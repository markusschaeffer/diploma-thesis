/**
 * Client (node) for REST communication
 */

var util = require('./../../util/util');
var clientUtil = require('./clientUtil');

module.exports = {

    getPeerCount: function (ip, port) {
        util.printFormatedMessage("SENDING getPeerCount REQUEST");
        let options = {
            method: 'GET',
            uri: 'http://' + ip + ':' + port + '/node-peer-count',
            body: {},
            json: true
        };

        clientUtil.sendRequest(options);
    },

    deployContract: function (ip, port, scenario) {
        util.printFormatedMessage("SENDING deployContract REQUEST");
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

    startBenchmark: function (ip, port, scenario, maxTransactions, maxRuntime, smartContractAddresses) {
        util.printFormatedMessage("SENDING startBenchmark REQUEST");
        let options = {
            method: 'POST',
            uri: 'http://' + ip + ':' + port + '/node-benchmark-start',
            body: {
                scenario: scenario,
                maxTransactions: maxTransactions,
                maxRuntime: maxRuntime,
                smartContractAddresses: smartContractAddresses
            },
            json: true
        };

        clientUtil.sendRequest(options);
    }
}