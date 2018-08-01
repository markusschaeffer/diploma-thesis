/**
 * Client for sending JSON requests to the server
 */

var util = require('./../../util/util');
var rp = require('request-promise');

module.exports = {

    logBenchmarkResult: async function (ip, port, usedGenesisJson, startTime, maxRuntime, runtime, maxRuntimeReached, maxTransactions, maxTransactionsReached, successfulTransactions, txPerSecond, averageDelay) {
        util.printFormatedMessage("SENDING logBenchmarkResult REQUEST");
        let options = {
            method: 'POST',
            uri: 'http://' + ip + ':' + port + '/benchmark-log',
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

    getPeerCount: function (ip, port) {
        util.printFormatedMessage("SENDING getPeerCount REQUEST");
        let options = {
            method: 'GET',
            uri: 'http://' + ip + ':' + port + '/peer-count',
            body: {},
            json: true
        };

        module.exports.sendRequest(options);
    },

    deployContract: function (ip, port, scenario) {
        util.printFormatedMessage("SENDING deployContract REQUEST");
        let options = {
            method: 'POST',
            uri: 'http://' + ip + ':' + port + '/contract-deploy',
            body: {
                scenario: scenario
            },
            json: true
        };

        module.exports.sendRequest(options);
    },

    startBenchmark: function (ip, port, scenario, maxTransactions, maxRuntime) {
        util.printFormatedMessage("SENDING startBenchmark REQUEST");
        let options = {
            method: 'POST',
            uri: 'http://' + ip + ':' + port + '/benchmark-start',
            body: {
                scenario: scenario,
                maxTransactions: maxTransactions,
                maxRuntime: maxRuntime
            },
            json: true
        };

        module.exports.sendRequest(options);
    },

    /**
     * see https://github.com/request/request-promise
     */
    sendRequest: function (options) {
        return new Promise(function (resolve, reject) {
            rp(options)
                .then(function (parsedBody) {
                    // request succeeded...
                    console.log("Response: " + JSON.stringify(parsedBody));

                    if (parsedBody.contractDeployed != null) {
                        //contracts have been deployed
                        //--> store contract addresses in storage folder
                        var filePath = __dirname + "/../../../../storage/contract_addresses_local/account.txt";
                        util.saveContractAddress(filePath, parsedBody.address1);
                        util.saveContractAddress(filePath, parsedBody.address2);
                    }

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