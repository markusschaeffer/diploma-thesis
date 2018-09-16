/**
 * benchmark-lib funcions
 */

const util = require('./../../util/util');
const exec = require('child_process').exec;
const restClient = require('./../../communication/restfulClient/client_node');
const publicIp = require('public-ip');
const pathToRootFolder = __dirname + "/../../../../";

//instantiate web3
const Web3 = require('web3');
var web3 = new Web3();
//set providers from Web3.providers
const ip = "localhost";
const httpPort = util.readFileSync_full(pathToRootFolder + "storage/ports/geth_http_port_node0.txt");
const httpProviderString = "http://" + ip + ":" + httpPort;
//http provider (node-0 PORT 8100, node-1 PORT 8101)
web3 = new Web3(new Web3.providers.HttpProvider(httpProviderString));

module.exports = {

    /**
     * Print result to stdout and send result via REST
     */
    logBenchmarkResult: async function (scenario, approach, benchmarkID, startTime, maxRuntime,
            maxRuntimeReached, maxTransactions, maxTransactionsReached,
            successfulTransactions, transactionsTimestampMapStart, transactionsTimestampMapEnd) {

            var runtime = Math.abs((new Date() - startTime) / 1000);
            var averageTxDelay = module.exports.caculateAverageDelayOfTransactions(transactionsTimestampMapStart, transactionsTimestampMapEnd, successfulTransactions);
            var txPerSecond = successfulTransactions / runtime;
            var ip;
            var peerCount;
            const usedGenesisJson = util.readFileSync_lines(pathToRootFolder + "storage/current_genesis_node/current_genesis.txt")[0];
            const targetGasLimit = util.readFileSync_lines(pathToRootFolder + "storage/mining_settings/target_gas_limit.txt")[0];
            const mining = util.readFileSync_lines(pathToRootFolder + "storage/mining_settings/mining.txt")[0];

            //query public ip
            publicIp.v4().then(function (_ip) {
                ip = _ip;
            }).then(function () {
                //query web3 peerCount
                web3.eth.net.getPeerCount().then(function (_peerCount) {
                        peerCount = _peerCount;
                    })
                    .then(function () {
                        //print and send BenchmarkResults
                        module.exports.printBenchmarkResults(ip, peerCount, scenario, approach, benchmarkID, usedGenesisJson, targetGasLimit, mining, startTime, maxRuntime, runtime, maxRuntimeReached, maxTransactions, maxTransactionsReached, successfulTransactions, txPerSecond, averageTxDelay);

                        module.exports.sendBenchmarkResults(ip, peerCount, scenario, approach, benchmarkID, usedGenesisJson, targetGasLimit, mining, startTime, maxRuntime, runtime, maxRuntimeReached, maxTransactions, maxTransactionsReached, successfulTransactions, txPerSecond, averageTxDelay)
                            .then(function () {
                                util.printFormatedMessage("KILLING PROCESS");
                                process.exit(0);
                            });
                    })
            });
        },

        /**
         * Calculate the average delay of transactions (endTimestamp - startTimestamp)
         */
        caculateAverageDelayOfTransactions: function (transactionsTimestampMapStart,
            transactionsTimestampMapEnd, successfulTransactions) {

            var averageTxDelay = 0;
            var summedUpTimeDifferences = 0;
            transactionsTimestampMapStart.forEach(function (value, key, map) {
                var endTimestamp = transactionsTimestampMapEnd.get(key);
                var timeDifferenceOfEndAndStart = (endTimestamp - value) / 1000;
                if (!isNaN(timeDifferenceOfEndAndStart))
                    summedUpTimeDifferences += timeDifferenceOfEndAndStart
            });
            averageTxDelay = summedUpTimeDifferences / successfulTransactions;

            return averageTxDelay;
        },

        /**
         * Print result of benchmark to stdout
         */
        printBenchmarkResults: function (ip, peerCount, scenario, approach, benchmarkID, usedGenesisJson,
            targetGasLimit, mining, startTime, maxRuntime, runtime, maxRuntimeReached, maxTransactions,
            maxTransactionsReached, successfulTransactions, txPerSecond, averageTxDelay) {

            console.log("\n");
            console.log("----------BENCHMARK RESULT----------");
            console.log("IP: " + ip);
            console.log("PeerCount:" + peerCount);
            console.log("-----------------------------");
            console.log("Scenario: " + scenario);
            console.log("Approach: " + approach);
            console.log("BenchmarkID: " + benchmarkID);
            console.log("-----------------------------");
            console.log("Genesis.json: " + usedGenesisJson);
            console.log("TargetGasLimit: " + targetGasLimit);
            console.log("Mining: " + mining);
            console.log("-----------------------------");
            console.log("Starttime: " + startTime);
            console.log("MaxRuntime: " + maxRuntime);
            console.log("Runtime: " + runtime);
            console.log("MaxRuntime reached: " + maxRuntimeReached);
            console.log("-----------------------------");
            console.log("MaxTransactions: " + maxTransactions);
            console.log("#Successful transactions: " + successfulTransactions);
            console.log("MaxTransactions reached: " + maxTransactionsReached);
            console.log("-----------------------------");
            console.log("Transactions per second: " + txPerSecond);
            console.log("Average transaction delay in seconds: " + averageTxDelay);
            console.log("-----------------------------");
            console.log("\n");
        },

        /**
         * Send benchmark result via REST interface
         */
        sendBenchmarkResults: async function (ip, peerCount, scenario, approach, benchmarkID,
                usedGenesisJson, targetGasLimit, mining, startTime, maxRuntime, runtime, maxRuntimeReached,
                maxTransactions, maxTransactionsReached, successfulTransactions, txPerSecond, averageTxDelay) {

                await restClient.logBenchmarkResult(ip, peerCount, scenario, approach, benchmarkID, usedGenesisJson, targetGasLimit, mining, startTime, maxRuntime, runtime, maxRuntimeReached, maxTransactions, maxTransactionsReached, successfulTransactions, txPerSecond, averageTxDelay);
            },

            /**
             * Get the geth process id (implies a running geth process)
             */
            getGethProcessId: function () {
                return new Promise(function (resolve, reject) {
                    exec("pgrep geth", function (error, stdout, stderr) {
                        var pid = stdout.split('\n')[0]; //get pid of geth process started first (node-0)
                        resolve(pid);
                        if (error !== null) {
                            reject(error);
                        }
                    });
                });
            },

            /**
             * Get the amount of open file descriptors of the system for a specifc process id
             */
            getAmountOfOpenFileDescriptorsForPID: function (gethPID) {
                return new Promise(function (resolve, reject) {
                    exec("sudo ls /proc/" + gethPID + "/fd | wc -l", function (error, stdout, stderr) {
                        resolve(stdout);
                        if (error !== null) {
                            reject(error);
                        }
                    });
                });
            }
};