/**
 * REST Controller
 */

const mongoose = require("mongoose");
const BenchmarkLog = mongoose.model("BenchmarkLog");
const exec = require('child_process').exec;
const util = require('./../../util/util.js');

//instantiate web3
var Web3 = require('web3');
var web3 = new Web3();
const directionToRootFolder = __dirname + "/../../../../";

//set providers from Web3.providers
var httpPort = 8100; //http provider (node-0 PORT 8100, node-1 PORT 8101)
var httpProviderString = "http://localhost:" + httpPort; //TODO IP?

web3 = new Web3(new Web3.providers.HttpProvider(httpProviderString));

/**
 * returns the peer-count of the node (amount of known peers in the network)
 */
exports.getPeerCount = (req, res) => {

    util.printFormatedMessage("RECEIVED getPeerCount REQUEST");
    var peerCount = -1;
    web3.eth.net.getPeerCount()
        .then(function (returnedPeerCount) {
            console.log("Peer Count is: " + returnedPeerCount);
            peerCount = returnedPeerCount;
            res.end(JSON.stringify(peerCount));
        }).catch((err) => {
            console.log(err);
            res.end(JSON.stringify(peerCount));
        });
};

/**
 * deploys contracts for different scenarios
 */
exports.deployContract = (req, res) => {

    util.printFormatedMessage("RECEIVED deployContract REQUEST");
    var jsonRequest = req.body;
    switch (jsonRequest.scenario) {
        case 'account':
            new Promise(function (resolve, reject) {
                    //deploy contract(s)
                    exec("cd " + directionToRootFolder + "; make sc_deploy_accounts;", function (error, stdout, stderr) {
                        resolve(stdout);
                        if (error !== null)
                            reject(error);
                    });
                }).then(function () {
                    //get contract addresses from storage folder of server
                    var filePath = directionToRootFolder + "storage/contract_addresses_server/account.txt";
                    var addresses = util.readFileSync_lines(filePath);
                    res.end(JSON.stringify({
                        contractDeployed: true,
                        address1: addresses[0],
                        address2: addresses[1]
                    }));
                })
                .catch(error => {
                    res.end(JSON.stringify("NOK - " + error));
                });
            break;
        case 'ballot':
            break;
        case 'readWrite':
            break;
        default:
            res.end(JSON.stringify("NOK - could not match specified scenario"));
    }

};

/**
 * starts a specific benchmark
 */
exports.startBenchmark = (req, res) => {

    util.printFormatedMessage("RECEIVED startBenchmark REQUEST");
    var jsonRequest = req.body;
    switch (jsonRequest.scenario) {
        case 'account':
            new Promise(function (resolve, reject) {
                    //start benchmark
                    console.log("jsonRequest.maxTransactions:" + jsonRequest.maxTransactions);
                    console.log("jsonRequest.maxRuntime:" + jsonRequest.maxRuntime);
                    console.log("jsonRequest.smartContractAddresses: " + jsonRequest.smartContractAddresses);
                    
                    exec("cd " + directionToRootFolder + "; make sc_run_accounts_without_deploy_node0" +
                        " maxTransactions=" + jsonRequest.maxTransactions +
                        " maxRuntime=" + jsonRequest.maxRuntime +
                        " address1=" + jsonRequest.smartContractAddresses[0] +
                        " address2=" + jsonRequest.smartContractAddresses[1] +
                        ";",
                        function (error, stdout, stderr) {
                            //var text = stdout.substring(stdout.indexOf("----------BENCHMARK RESULT----------"));
                            resolve(stdout); //todo: enable/disable?
                            if (error !== null)
                                reject(error);
                        });
                    res.end(JSON.stringify("benchmark started")); //todo: disable?
                })
                .then(function (result) {
                    res.end(JSON.stringify(result));
                })
                .catch(error => {
                    res.end(JSON.stringify("NOK - " + error));
                });
            break;
        case 'ballot':
            break;
        case 'readWrite':
            break;
        default:
            res.end(JSON.stringify("NOK - could not match specified scenario"));
    }
};

/**
 * stores a benchmark-log-result to the database
 */
exports.logBenchmark = (req, res) => {

    util.printFormatedMessage("RECEIVED logBenchmark REQUEST");
    var jsonRequest = req.body;
    console.log(jsonRequest);

    let newBenchmarkLog = new BenchmarkLog(req.body);
    util.printFormatedMessage("TRYING TO SAVE BENCHMARK LOG RESULT TO DB");
    newBenchmarkLog.save((err, result) => {
        if (err)
            res.send(err);
        console.log("Result:" + result);
        res.end(JSON.stringify("OK"));
    });
};