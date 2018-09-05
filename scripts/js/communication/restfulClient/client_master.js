/**
 * Client (node) for REST communication
 */

const util = require('./../../util/util');
const clientUtil = require('./clientUtil');

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

    startBootnode: function (ip, port) {
        util.printFormatedMessage("SENDING startBootnode REQUEST");
        let options = {
            method: 'POST',
            uri: 'http://' + ip + ':' + port + '/bootnode-start',
            body: {},
            json: true
        };

        clientUtil.sendRequest(options);
    },

    startNetstats: function (ip, port) {
        util.printFormatedMessage("SENDING startNetstats REQUEST");
        let options = {
            method: 'POST',
            uri: 'http://' + ip + ':' + port + '/netstats-start',
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

    startBenchmark: function (ip, port, scenario, approach, benchmarkID, maxTransactions, maxRuntime, smartContractAddresses) {
        util.printFormatedMessage("SENDING startBenchmark REQUEST");
        let options = {
            method: 'POST',
            uri: 'http://' + ip + ':' + port + '/node-benchmark-start',
            body: {
                scenario: scenario,
                approach: approach,
                benchmarkID: benchmarkID,
                maxTransactions: maxTransactions,
                maxRuntime: maxRuntime,
                smartContractAddresses: smartContractAddresses
            },
            json: true
        };

        clientUtil.sendRequest(options);
    }
}