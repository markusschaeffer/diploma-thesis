/**
 * https://github.com/request/request-promise
 */

var rp = require('request-promise');

var peersCount_options = {
    method: 'GET',
    uri: 'http://localhost:8999/peers-count',
    body: {},
    json: true
};

var contractDeploy_options = {
    method: 'POST',
    uri: 'http://localhost:8999/contract-deploy',
    body: {
        name: "account.js"
    },
    json: true
};

var benchmarkStart_options = {
    method: 'POST',
    uri: 'http://localhost:8999/benchmark-start',
    body: {
        genesisJson: "genesis.json",
        maxbenchmarkRuntime: 10,
        maxbenchmarkTransactions: 1000
    },
    json: true
};

var benchmarkLog_options = {
    method: 'POST',
    uri: 'http://localhost:8999/benchmark-log',
    body: {
        usedGenesisJson: "genesis.json",
        startTime: new Date,
        maxRuntime: 1000,
        runtime: 100,
        maxRuntimeReached: false,
        maxTransactions: 1000,
        maxTransactionsReached: true,
        successfulTransactions: 1000,
        txPerSecond: 20,
        averageDelay: 10
    },
    json: true
};

rp(benchmarkLog_options)
    .then(function (parsedBody) {
        // POST succeeded...
        console.log(parsedBody)
    })
    .catch(function (err) {
        // POST failed...
        console.log(err);
    });