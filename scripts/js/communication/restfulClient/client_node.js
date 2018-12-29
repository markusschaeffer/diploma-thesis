/**
 * Client (node) for REST communication
 */

const pathToRootFolder = __dirname + "/../../../../";

var util = require('./../../util/util');
var clientUtil = require('./clientUtil');

var masterIP = util.readFileSync_lines(pathToRootFolder + "storage/ips/master_ip.txt")[0];
const masterRestPort = util.readFileSync_lines(pathToRootFolder + "config/ports/master_port.txt")[0];

module.exports = {

    logBenchmarkResult: async function (ip, peerCount, hashRate, instanceType, scenario, approach, benchmarkID,
        usedGenesisJson, difficulty, gasLimit, targetGasLimit, mining, miningOnFullWorkload, startTime, maxRuntime,
        runtime, maxRuntimeReached, maxTransactions, maxTransactionsReached, successfulTransactions, txPerSecond, averageDelay) {

        util.printFormatedMessage("SENDING logBenchmarkResult REQUEST");
        masterIP = util.readFileSync_lines(pathToRootFolder + "storage/ips/master_ip.txt")[0];

        let options = {
            method: 'POST',
            uri: 'http://' + masterIP + ':' + masterRestPort + '/master-benchmark-log',
            body: {
                ip: ip,
                peerCount: peerCount,
                hashRate: hashRate,
                instanceType: instanceType,
                scenario: scenario,
                approach: approach,
                benchmarkID: benchmarkID,
                usedGenesisJson: usedGenesisJson,
                difficulty: difficulty,
                gasLimit: gasLimit,
                targetGasLimit: targetGasLimit,
                mining: mining,
                miningOnFullWorkload: miningOnFullWorkload,
                startTime: startTime,
                maxRuntime: maxRuntime,
                runtime: runtime,
                maxRuntimeReached: maxRuntimeReached,
                maxTransactions: maxTransactions,
                maxTransactionsReached: maxTransactionsReached,
                successfulTransactions: successfulTransactions,
                txPerSecond: txPerSecond,
                averageDelay: averageDelay
            },
            json: true
        };

        await clientUtil.sendRequest(options);
    },

    sendContractAddresses: async function (scenario, address) {
        util.printFormatedMessage("SENDING sendContractAddresses REQUEST");
        masterIP = util.readFileSync_lines(pathToRootFolder + "storage/ips/master_ip.txt")[0];

        let options = {
            method: 'POST',
            uri: 'http://' + masterIP + ':' + masterRestPort + '/master-contract-address-receive',
            body: {
                scenario: scenario,
                address: address
            },
            json: true
        };

        await clientUtil.sendRequest(options);
    },

    sendNodeIP: async function (master_IP, own_IP) {
        util.printFormatedMessage("SENDING sendNodeIP REQUEST");

        let options = {
            method: 'POST',
            uri: 'http://' + master_IP + ':' + masterRestPort + '/master-store-ip-node',
            body: {
                ip: own_IP
            },
            json: true
        };

        await clientUtil.sendRequest(options);
    }
}