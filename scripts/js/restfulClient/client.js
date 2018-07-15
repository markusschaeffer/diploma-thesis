/**
 * https://github.com/request/request-promise
 */

var rp = require('request-promise');

var options = {
    method: 'POST',
    uri: 'http://localhost:8999/',
    body: {
        genesisJson: "genesis.json",
        amountNodes: 0,
        runtime: 0,
        successTransactions: 0,
        txPerSecond:0,
        averageDelay:0,
    },
    json: true // Automatically stringifies the body to JSON
};

rp(options)
    .then(function (parsedBody) {
        // POST succeeded...
        console.log(parsedBody)
    })
    .catch(function (err) {
        // POST failed...
        console.log(err);
    });