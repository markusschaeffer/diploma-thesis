/**
 * Client (master) for REST communication
 */

const util = require('./../../util/util');
const clientUtil = require('./clientUtil');

module.exports = {

    startGeth: function (ip, port, genesis, targetGasLimit, mining, miningOnFullWorkload, instanceType, masterIP, bootnodeIP, netstatsIP) {
        util.printFormatedMessage("SENDING startGeth REQUEST to " + ip);
        let options = {
            method: 'POST',
            uri: 'http://' + ip + ':' + port + '/node-geth-start',
            body: {
                genesis: genesis,
                targetGasLimit: targetGasLimit,
                mining: mining,
                miningOnFullWorkload : miningOnFullWorkload,
                instanceType: instanceType,
                masterIP: masterIP,
                bootnodeIP: bootnodeIP,
                netstatsIP: netstatsIP
            },
            json: true
        };

        clientUtil.sendRequest(options);
    },

    getPeerCount: function (ip, port) {
        util.printFormatedMessage("SENDING getPeerCount REQUEST to " + ip);
        let options = {
            method: 'GET',
            uri: 'http://' + ip + ':' + port + '/node-peer-count',
            body: {},
            json: true
        };

        clientUtil.sendRequest(options);
    },

    startBootnode: function (ip, port) {
        util.printFormatedMessage("SENDING startBootnode REQUEST to " + ip);
        let options = {
            method: 'POST',
            uri: 'http://' + ip + ':' + port + '/bootnode-start',
            body: {},
            json: true
        };

        clientUtil.sendRequest(options);
    },

    startNetstats: function (ip, port) {
        util.printFormatedMessage("SENDING startNetstats REQUEST to " + ip);
        let options = {
            method: 'POST',
            uri: 'http://' + ip + ':' + port + '/netstats-start',
            body: {},
            json: true
        };

        clientUtil.sendRequest(options);
    },

    deployContract: function (ip, port, scenario) {
        util.printFormatedMessage("SENDING deployContract REQUEST for " + scenario + " to " + ip);
        let options = {
            method: 'POST',
            uri: 'http://' + ip + ':' + port + '/node-contract-deploy',
            body: {
                scenario: scenario
            },
            json: true
        };

        clientUtil.sendRequest(options);
    },

    startBenchmark: function (ip, port, scenario, approach, benchmarkID, maxTransactions, maxRuntime, smartContractAddresses) {
        util.printFormatedMessage("SENDING startBenchmark REQUEST for " + scenario + " to " + ip);

        util.printFormatedMessage("");
        console.log("scenario:" + scenario);
        console.log("approach:" + approach);
        console.log("benchmarkID:" + benchmarkID);
        console.log("maxTransactions:" + maxTransactions);
        console.log("maxRuntime:" + maxRuntime);
        console.log("smartContractAddresses:" + smartContractAddresses);
        util.printFormatedMessage("");

        let options = {
            method: 'POST',
            uri: 'http://' + ip + ':' + port + '/node-benchmark-start',
            body: {
                scenario: scenario,
                approach: approach,
                benchmarkID: benchmarkID,
                maxTransactions: maxTransactions,
                maxRuntime: maxRuntime,
                smartContractAddresses: smartContractAddresses
            },
            json: true
        };

        clientUtil.sendRequest(options);
    }
}