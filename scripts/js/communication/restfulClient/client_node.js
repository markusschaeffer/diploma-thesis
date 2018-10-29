/**
 * Client (node) for REST communication
 */

var util = require('./../../util/util');
var clientUtil = require('./clientUtil');

const pathToRootFolder = __dirname + "/../../../../";
const masterIP = util.readFileSync_lines(pathToRootFolder + "config/ips/master_ip.txt")[0];
const port = util.readFileSync_lines(pathToRootFolder + "config/ports/master_port.txt")[0];

module.exports = {

    logBenchmarkResult: async function (ip, peerCount, hashRate, instanceType, scenario, approach, benchmarkID,
            usedGenesisJson, difficulty, gasLimit, targetGasLimit, mining, startTime, maxRuntime, runtime, maxRuntimeReached,
            maxTransactions, maxTransactionsReached, successfulTransactions, txPerSecond, averageDelay) {

            util.printFormatedMessage("SENDING logBenchmarkResult REQUEST");

            let options = {
                method: 'POST',
                uri: 'http://' + masterIP + ':' + port + '/master-benchmark-log',
                body: {
                    ip: ip,
                    peerCount: peerCount,
                    hashRate: hashRate,
                    instanceType: instanceType,
                    scenario: scenario,
                    approach: approach,
                    benchmarkID: benchmarkID,
                    usedGenesisJson: usedGenesisJson,
                    difficulty: difficulty,
                    gasLimit: gasLimit,
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
        },

        sendContractAddresses: async function (scenario, address) {
                util.printFormatedMessage("SENDING sendContractAddresses REQUEST");

                let options = {
                    method: 'POST',
                    uri: 'http://' + masterIP + ':' + port + '/master-contract-address-receive',
                    body: {
                        scenario: scenario,
                        address: address
                    },
                    json: true
                };

                await clientUtil.sendRequest(options);
            },

            sendNodeIP: async function (ip) {
                util.printFormatedMessage("SENDING sendNodeIP REQUEST");

                let options = {
                    method: 'POST',
                    uri: 'http://' + masterIP + ':' + port + '/master-store-ip-node',
                    body: {
                        ip: ip
                    },
                    json: true
                };

                await clientUtil.sendRequest(options);
            }
}