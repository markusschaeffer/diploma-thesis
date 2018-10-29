/**
 * Communication - lib
 * 
 * Note:    config/ips/nodes_ip.txt and config/ports/nodes_port.txt 
 *          holds information of IPs and port of the nodes
 * 
 */

const mongoose = require('mongoose');
const model_master = require('./restfulAPI/master/model_master');
const readLastLines = require('read-last-lines');

const util = require('./../util/util');
const client = require('./restfulClient/client_master');

const pathToRootFolder = __dirname + "/../../../";
const benchmarkStartNodes = util.readFileSync_lines(pathToRootFolder + "config/benchmark_settings/benchmark_start_nodes.txt");
const dbname = util.readFileSync_lines(pathToRootFolder + "config/db_settings/db_name.txt")[0];
const dbIP = util.readFileSync_lines(pathToRootFolder + "config/db_settings/db_ip.txt")[0];
const dbPort = util.readFileSync_lines(pathToRootFolder + "config/db_settings/db_port.txt")[0];
const ips = util.readFileSync_lines(pathToRootFolder + "config/ips/nodes_ip.txt");
const port = util.readFileSync_lines(pathToRootFolder + "config/ports/node_port.txt")[0];

module.exports = {

    startBenchmark: function (scenario, approach, maxTransactions, maxRuntime) {

        const pathToSmartContractAddresses = pathToRootFolder + "storage/contract_addresses_local/" + scenario + ".txt";
        var smartContractAddresses = [];
        var benchmarkId;

        //query mongoDB for amount of stored logs and initiallize benchmarkId with the result
        mongoose.Promise = global.Promise;
        mongoose.connect("mongodb://" + dbIP + ":" + dbPort + "/" + dbname, {
                useNewUrlParser: true
            })
            .then(() => console.log("connected to mongoDB"))
            .then(() =>
                model_master.estimatedDocumentCount(function (err, count) {
                    benchmarkId = count;
                })
            )
            .then(() => mongoose.connection.close())
            .then(() => console.log("mongoDB connection closed"))
            .catch(err => console.log(err));

        try {

            util.printFormatedMessage("");
            console.log("scenario: " + scenario);
            console.log("approach: " + approach);
            console.log("maxTransactions: " + maxTransactions);
            console.log("maxRuntime: " + maxRuntime);
            util.printFormatedMessage("");

            switch (scenario) {
                case "account":
                    //get deployed smart contract addresses from local storage folder
                    //read the two last lines
                    readLastLines.read(pathToSmartContractAddresses, 2)
                        .then(function (lines) {
                            smartContractAddresses = lines.split("\n").splice(0, 2);
                        })
                        .then(function () {
                            module.exports.sendStartBenchmarkRequests(scenario, approach, benchmarkId, maxTransactions, maxRuntime, smartContractAddresses);
                        });
                    break;
                case "ballot":
                    //get the deployed smart contract address from local storage folder
                    //read the last line1
                    readLastLines.read(pathToSmartContractAddresses, 1)
                        .then(function (lines) {
                            smartContractAddresses = lines.split("\n").splice(0, 2);
                        })
                        .then(function () {
                            module.exports.sendStartBenchmarkRequests(scenario, approach, benchmarkId, maxTransactions, maxRuntime, smartContractAddresses);
                        });
                    break;
                case "readWrite":
                    break;
                default:
                    throw new Error("Scenario not found");
            }
        } catch (error) {
            console.log(error);
        }
    },

    sendStartBenchmarkRequests: function (scenario, approach, benchmarkId, maxTransactions, maxRuntime, smartContractAddresses) {
        
        if (benchmarkStartNodes.length == 0) {
            //start benchmark on first node of storage/ips/nodes_ip.txt
            client.startBenchmark(ips[0], port, scenario, approach, benchmarkId, maxTransactions, maxRuntime, smartContractAddresses);
        } else {
            //start benchmark on nodes specified in benchmark_start_nodes.txt
            for (var i = 0; i <= ips.length - 1; i++) {
                if (benchmarkStartNodes[i] == "true") {
                    client.startBenchmark(ips[i], port, scenario, approach, benchmarkId, maxTransactions, maxRuntime, smartContractAddresses);
                }
            }
        }
    }

}