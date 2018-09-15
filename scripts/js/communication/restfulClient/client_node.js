/**
 * Client (master) for REST communication
 */

var util = require('./../../util/util');
var clientUtil = require('./clientUtil');

module.exports = {

    logBenchmarkResult: async function (ip, peerCount, scenario, approach, benchmarkID, usedGenesisJson, startTime, maxRuntime, runtime, maxRuntimeReached, maxTransactions, maxTransactionsReached, successfulTransactions, txPerSecond, averageDelay) {
        util.printFormatedMessage("SENDING logBenchmarkResult REQUEST");

        var masterIP = util.readFileSync_lines(__dirname + "/../../../../storage/ips/master_ip.txt")[0];
        var port = util.readFileSync_lines(__dirname + "/../../../../storage/ports/master_port.txt")[0];

        let options = {
            method: 'POST',
            uri: 'http://' + masterIP + ':' + port + '/master-benchmark-log',
            body: {
                ip: ip,
                peerCount: peerCount,
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