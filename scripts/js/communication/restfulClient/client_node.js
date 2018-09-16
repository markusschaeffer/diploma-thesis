/**
 * Client (master) for REST communication
 */

var util = require('./../../util/util');
var clientUtil = require('./clientUtil');

const pathToRootFolder = __dirname + "/../../../../";

module.exports = {

    logBenchmarkResult: async function (ip, peerCount, hashRate, scenario, approach, benchmarkID, usedGenesisJson, targetGasLimit, mining, startTime, maxRuntime, runtime, maxRuntimeReached, maxTransactions, maxTransactionsReached, successfulTransactions, txPerSecond, averageDelay) {
        util.printFormatedMessage("SENDING logBenchmarkResult REQUEST");

        var masterIP = util.readFileSync_lines(pathToRootFolder + "storage/ips/master_ip.txt")[0];
        var port = util.readFileSync_lines(pathToRootFolder + "storage/ports/master_port.txt")[0];

        let options = {
            method: 'POST',
            uri: 'http://' + masterIP + ':' + port + '/master-benchmark-log',
            body: {
                ip: ip,
                peerCount: peerCount,
                hashRate: hashRate,
                scenario: scenario,
                approach: approach,
                benchmarkID: benchmarkID,
                usedGenesisJson: usedGenesisJson,
                targetGasLimit: targetGasLimit,
                mining: mining,
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
    }
}