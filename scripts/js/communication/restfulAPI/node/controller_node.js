/**
 * REST Controller (node)
 */

const exec = require('child_process').exec;
const spawn = require('child_process').spawn;
const util = require('./../../../util/util.js');
const publicIp = require('public-ip');

//instantiate web3
const Web3 = require('web3');
var web3 = new Web3();
const pathToRootFolder = __dirname + "/../../../../../";

//set providers from Web3.providers
var httpPort = 8100; //http provider (node-0 PORT 8100, node-1 PORT 8101)
var httpProviderString = "http://localhost:" + httpPort;

web3 = new Web3(new Web3.providers.HttpProvider(httpProviderString));

/**
 * starts geth client on a node
 */
exports.startGeth = (req, res) => {
    var ip;
    publicIp.v4().then(function (_ip) {
        ip = _ip;
    }).then(function () {

        util.printFormatedMessage(ip + " RECEIVED startGeth REQUEST");
        const jsonRequest = req.body;

        //update current_genesis.txt @ node
        util.writeToFile(pathToRootFolder + "storage/current_genesis_node/current_genesis.txt", jsonRequest.genesis);

        //update bootnode_ip.txt @ node
        util.writeToFile(pathToRootFolder + "storage/ips/bootnode_ip.txt", jsonRequest.bootnodeIP);

        //update netstats_ip.txt @ node
        util.writeToFile(pathToRootFolder + "storage/ips/netstats_ip.txt", jsonRequest.netstatsIP);
        
        //start geth client
        var child = spawn("cd " + pathToRootFolder + "; make geth_start;", {
            stdio: 'inherit',
            shell: true
        });

        //end connection
        res.end(JSON.stringify(ip + ": geth start initiated"));

    }).catch((err) => {
        console.log(err);
        res.end(JSON.stringify(ip + ": NOK - " + error));
    });

};

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
                        var child = exec("cd " + pathToRootFolder + "; make sc_deploy_accounts;", function (error, stdout, stderr) {
                            resolve(stdout);
                            if (error !== null)
                                reject(error);
                        });
                        // attach listeners to the stdout and stderr.
                        exports.attachListeners(child);

                    }).then(function () {
                        //get contract addresses from storage folder of server
                        var filePath = pathToRootFolder + "storage/contract_addresses_node/account.txt";
                        var addresses = util.readFileSync_lines(filePath);
                        res.end(JSON.stringify({
                            accountDeployed: true,
                            address1: addresses[0],
                            address2: addresses[1]
                        }));
                    })
                    .catch(error => {
                        res.end(JSON.stringify(ip + ": NOK - " + error));
                    });
                break;
            case 'ballot':
                new Promise(function (resolve, reject) {
                        //deploy contract(s) via make rule
                        var child = exec("cd " + pathToRootFolder + "; make sc_deploy_ballot;", function (error, stdout, stderr) {
                            resolve(stdout);
                            if (error !== null)
                                reject(error);
                        });
                        // attach listeners to the stdout and stderr.
                        exports.attachListeners(child);

                    }).then(function () {
                        //get contract addresses from storage folder of server
                        var filePath = pathToRootFolder + "storage/contract_addresses_node/ballot.txt";
                        var address = util.readFileSync_lines(filePath)[0];
                        res.end(JSON.stringify({
                            ballotDeployed: true,
                            address: address
                        }));
                    })
                    .catch(error => {
                        res.end(JSON.stringify(ip + ": NOK - " + error));
                    });
                break;
            case 'readWrite':
                //TODO------------------------------------------------------------------------------------------------
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
                        var child = exec("cd " + pathToRootFolder + "; make sc_run_accounts_node0" +
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
                        // attach listeners to the stdout and stderr.
                        exports.attachListeners(child);

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
                new Promise(function (resolve, reject) {
                        //start account scenario benchmark
                        var child = exec("cd " + pathToRootFolder + "; make sc_run_ballot_node0" +
                            " maxTransactions=" + jsonRequest.maxTransactions +
                            " maxRuntime=" + jsonRequest.maxRuntime +
                            " address=" + jsonRequest.smartContractAddresses[0] +
                            " benchmarkID=" + jsonRequest.benchmarkID +
                            ";",
                            function (error, stdout, stderr) {
                                resolve(stdout);
                                if (error !== null)
                                    reject(error);
                            });
                        // attach listeners to the stdout and stderr.
                        exports.attachListeners(child);

                        res.end(JSON.stringify(ip + ": benchmark with benchmarkID " + jsonRequest.benchmarkID + " started"));
                    })
                    .then(function (result) {
                        res.end(JSON.stringify(result));
                    })
                    .catch(error => {
                        res.end(JSON.stringify(ip + ": NOK - " + error));
                    });
                break;
            case 'readWrite':
                //TODO------------------------------------------------------------------------------------------------------------------------
                break;
            default:
                res.end(JSON.stringify(ip + ": NOK - could not match specified scenario"));
        };
    });

};

exports.attachListeners = function (child) {
    child.stdout.on('data', function (data) {
        console.log(data);
    });
    child.stderr.on('data', function (data) {
        console.log(data);
    });
    child.on('close', function (close) {
        console.log(close);
    });
};