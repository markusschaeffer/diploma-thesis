/**
 * Script for starting benchmarks via REST API
 * 
 * Note:    storage/ips/nodes_ip.txt and storage/ports/nodes_port.txt 
 *          holds information of IPs and port of the nodes
 * 
 * process.argv[2]: scenario (account, ballot, readWrite)
 * process.argv[3]: approach (1-3)
 * process.argv[4]: broadcastBenchmark (true    = benchmark will be started on each node, 
 *                                      false   = benchmark will be started on nodes specified in storage/benchmark_settings/benchmark_start.txt)
 * process.argv[5]: maxTransactions (e.g. 1-10000)
 * process.argv[6]: maxRuntime (maxRuntime in minutes, e.g. 10)
 */

const util = require('./../util/util');
const client = require('./restfulClient/client_master');
const readLastLines = require('read-last-lines');

const mongoose = require('mongoose');
const model_master = require('./restfulAPI/master/model_master');

var scenario = process.argv[2];
var approach = process.argv[3];
var broadcastBenchmark = process.argv[4];
var maxTransactions = process.argv[5];
var maxRuntime = process.argv[6];

//default values for cli arguments
if (scenario == undefined) scenario = "account";
if (approach == undefined) approach = 3;
if (broadcastBenchmark == undefined) broadcastBenchmark = true;
if (maxTransactions == undefined) maxTransactions = 1000;
if (maxRuntime == undefined) maxRuntime = 10;

const pathToRootFolder = __dirname + "/../../../";
const port = util.readFileSync_lines(pathToRootFolder + "storage/ports/node_port.txt")[0];
const pathToSmartContractAddresses = pathToRootFolder + "storage/contract_addresses_local/" + scenario + ".txt";

const ips = util.readFileSync_lines(pathToRootFolder + "storage/ips/nodes_ip.txt");
const startBenchmarkNodes = util.readFileSync_lines(pathToRootFolder + "storage/benchmark_settings/benchmark_start.txt");

var smartContractAddresses = [];
var benchmarkId;

//query mongoDB for amount of stored logs and initiallize benchmarkId with the result
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/test")
    .then(() => console.log("connected to mongoDB"))
    .then(() =>
        model_master.count(function (err, count) {
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
    console.log("broadcastBenchmark: " + broadcastBenchmark);
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
                    sendStartBenchmarkRequests();
                });
            break;
        case "ballot":
            //get the deployed smart contract address from local storage folder
            //read the last line1
            readLastLines.read(pathToSmartContractAddresses, 1)
                .then(function (lines) {
                    smartContractAddresses = lines.split("\n").splice(0, 2);
                    console.log()
                })
                .then(function () {
                    sendStartBenchmarkRequests();
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

function sendStartBenchmarkRequests() {
    if (broadcastBenchmark == true) {
        //start benchmark on each node of storage/ips/nodes_ip.txt
        for (var i = 0; i <= ips.length - 1; i++) {
            client.startBenchmark(ips[i], port, scenario, approach, benchmarkId, maxTransactions, maxRuntime, smartContractAddresses);
            benchmarkId++;
        }
    } else {
        //start benchmark on nodes specified in benchmark_start.txt
        for (var i = 0; i <= ips.length - 1; i++) {
            if (startBenchmarkNodes[i] == "true") {
                client.startBenchmark(ips[i], port, scenario, approach, benchmarkId, maxTransactions, maxRuntime, smartContractAddresses);
                benchmarkId++;
            }
        }
    }
}