/**
 * https://github.com/request/request-promise
 */

var util = require('./../../util/util');
var rp = require('request-promise');

module.exports = {

    logBenchmarkResult: async function (usedGenesisJson, startTime, maxRuntime, runtime, maxRuntimeReached, maxTransactions, maxTransactionsReached, successfulTransactions, txPerSecond, averageDelay) {
        util.printFormatedMessage("SENDING BENCHMARK LOG RESULTS VIA REST");

        let options = {
            method: 'POST',
            uri: 'http://localhost:8999/benchmark-log',
            body: {
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

        await module.exports.sendRequest(options);
    },

    getPeerCount: function (ip) {
        let options = {
            method: 'GET',
            uri: 'http://localhost:' + ip + '/peer-count',
            body: {},
            json: true
        };

        module.exports.sendRequest(options);
    },

    deployContract: function () {
        let options = {
            method: 'POST',
            uri: 'http://localhost:8999/contract-deploy',
            body: {
                name: "account.js"
            },
            json: true
        };

        module.exports.sendRequest(options);
    },

    startBenchmark: function () {
        let options = {
            method: 'POST',
            uri: 'http://localhost:8999/benchmark-start',
            body: {
                genesisJson: "genesis.json",
                maxbenchmarkRuntime: 10,
                maxbenchmarkTransactions: 1000
            },
            json: true
        };

        module.exports.sendRequest(options);
    },

    sendRequest: function (options) {
        return new Promise(function (resolve, reject) {
            rp(options)
                .then(function (parsedBody) {
                    // request succeeded...
                    console.log("Response: " + JSON.stringify(parsedBody));
                    resolve(parsedBody);
                })
                .catch(function (err) {
                    // request failed...
                    console.log(err);
                    reject(err);
                });
        });

    }
}