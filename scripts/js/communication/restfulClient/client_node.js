/**
 * Client (local) for REST communication
 */

var util = require('./../../util/util');
var clientUtil = require('./clientUtil');

module.exports = {

    logBenchmarkResult: async function (ip, scenario, approach, benchmarkID, usedGenesisJson, startTime, maxRuntime, runtime, maxRuntimeReached, maxTransactions, maxTransactionsReached, successfulTransactions, txPerSecond, averageDelay) {
        util.printFormatedMessage("SENDING logBenchmarkResult REQUEST");

        var masterIP = '127.0.0.1'; //TODO read MASTER IP from Storage-----------------------------------------------------------
        var port = 8998;

        let options = {
            method: 'POST',
            uri: 'http://' + masterIP + ':' + port + '/local-benchmark-log',
            body: {
                ip: ip,
                scenario: scenario,
                approach: approach,
                benchmarkID: benchmarkID,
                usedGenesisJson: usedGenesisJson,
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