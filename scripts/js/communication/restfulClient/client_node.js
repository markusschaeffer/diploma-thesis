/**
 * Client (local) for REST communication
 */

var util = require('./../../util/util');
var clientUtil = require('./clientUtil');

module.exports = {

    logBenchmarkResult: async function (benchmark, scenario, ip, port, usedGenesisJson, startTime, maxRuntime, runtime, maxRuntimeReached, maxTransactions, maxTransactionsReached, successfulTransactions, txPerSecond, averageDelay) {
        util.printFormatedMessage("SENDING logBenchmarkResult REQUEST");

        var localMasterIP = '127.0.0.1'; //TODO read LOCAL IP from Storage?-----------------------------------------------------------

        let options = {
            method: 'POST',
            uri: 'http://' + localMasterIP + ':' + port + '/local-benchmark-log',
            body: {
                benchmark: benchmark,
                scenario: scenario,
                ip: ip,
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