/**
 * REST Controller (node)
 */

const exec = require('child_process').exec;
const util = require('./../../../util/util.js');
const publicIp = require('public-ip');

//instantiate web3
const Web3 = require('web3');
var web3 = new Web3();
const directionToRootFolder = __dirname + "/../../../../../";

//set providers from Web3.providers
var httpPort = 8100; //http provider (node-0 PORT 8100, node-1 PORT 8101)
var httpProviderString = "http://localhost:" + httpPort;

web3 = new Web3(new Web3.providers.HttpProvider(httpProviderString));

/**
 * returns the peer-count of the node (amount of known peers in the network)
 */
exports.getPeerCount = (req, res) => {

    var peerCount = -1;
    var ip;
    publicIp.v4().then(function (_ip) {
        ip = _ip;
    }).then(function () {
        util.printFormatedMessage(ip + " RECEIVED getPeerCount REQUEST");
        web3.eth.net.getPeerCount().then(function (_peerCount) {
            console.log(ip + ": Peer Count is: " + _peerCount);
            peerCount = _peerCount;
            res.end(JSON.stringify({
                ip: ip,
                peerCount: peerCount
            }));
        }).catch((err) => {
            console.log(err);
            res.end(JSON.stringify({
                ip: ip,
                peerCount: peerCount
            }));
        });
    })
};

/**
 * deploys contracts for different scenarios
 */
exports.deployContract = (req, res) => {

    var ip;
    publicIp.v4().then(function (_ip) {
        ip = _ip;
    }).then(function () {
        util.printFormatedMessage(ip + ": RECEIVED deployContract REQUEST");
        var jsonRequest = req.body;
        switch (jsonRequest.scenario) {
            case 'account':
                new Promise(function (resolve, reject) {
                        //deploy contract(s) via make rule
                        exec("cd " + directionToRootFolder + "; make sc_deploy_accounts;", function (error, stdout, stderr) {
                            resolve(stdout);
                            if (error !== null)
                                reject(error);
                        });
                    }).then(function () {
                        //get contract addresses from storage folder of server
                        var filePath = directionToRootFolder + "storage/contract_addresses_node/account.txt";
                        var addresses = util.readFileSync_lines(filePath);
                        res.end(JSON.stringify({
                            contractDeployed: true,
                            address1: addresses[0],
                            address2: addresses[1]
                        }));
                    })
                    .catch(error => {
                        res.end(JSON.stringify(ip + ": NOK - " + error));
                    });
                break;
            case 'ballot':
                break;
            case 'readWrite':
                break;
            default:
                res.end(JSON.stringify(ip + ": NOK - could not match specified scenario"));
        }
    })
};

/**
 * starts a specific benchmark
 */
exports.startBenchmark = (req, res) => {

    var ip;
    publicIp.v4().then(function (_ip) {
        ip = _ip;
    }).then(function () {
        util.printFormatedMessage(ip + " RECEIVED startBenchmark REQUEST");
        var jsonRequest = req.body;

        console.log("jsonRequest.maxTransactions:" + jsonRequest.maxTransactions);
        console.log("jsonRequest.maxRuntime:" + jsonRequest.maxRuntime);
        console.log("jsonRequest.smartContractAddresses: " + jsonRequest.smartContractAddresses);
        console.log("jsonRequest.benchmarkID:" + jsonRequest.benchmarkID);

        switch (jsonRequest.scenario) {
            case 'account':
                new Promise(function (resolve, reject) {
                        //start account scenario benchmark
                        exec("cd " + directionToRootFolder + "; make sc_run_accounts_node0" +
                            " maxTransactions=" + jsonRequest.maxTransactions +
                            " maxRuntime=" + jsonRequest.maxRuntime +
                            " address1=" + jsonRequest.smartContractAddresses[0] +
                            " address2=" + jsonRequest.smartContractAddresses[1] +
                            " benchmarkID=" + jsonRequest.benchmarkID +
                            ";",
                            function (error, stdout, stderr) {
                                resolve(stdout);
                                if (error !== null)
                                    reject(error);
                            });
                        res.end(JSON.stringify(ip + ": benchmark with benchmarkID " + jsonRequest.benchmarkID + " started"));
                    })
                    .then(function (result) {
                        res.end(JSON.stringify(result));
                    })
                    .catch(error => {
                        res.end(JSON.stringify(ip + ": NOK - " + error));
                    });
                break;
            case 'ballot':
                break;
            case 'readWrite':
                break;
            default:
                res.end(JSON.stringify(ip + ": NOK - could not match specified scenario"));
        };
    });

};