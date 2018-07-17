/**
 * benchmark-lib funcions
 */

var util = require('./../../util/util');
var exec = require('child_process').exec;
var restClient = require('./../../communication/restfulClient/client');

module.exports = {

    /**
     * Print result to stdout and send result via REST
     */
    logBenchmarkResult: async function (usedGenesisJson, startTime, maxRuntime, maxRuntimeReached, maxTransactions, maxTransactionsReached, successfulTransactions, transactionsTimestampMapStart, transactionsTimestampMapEnd) {
        var runtime = Math.abs((new Date() - startTime) / 1000);
        var averageTxDelay = module.exports.caculateAverageDelayOfTransactions(transactionsTimestampMapStart, transactionsTimestampMapEnd, successfulTransactions);
        var txPerSecond = successfulTransactions / runtime;

        module.exports.printBenchmarkResults(usedGenesisJson, startTime, maxRuntime, runtime, maxRuntimeReached, maxTransactions, maxTransactionsReached, successfulTransactions, txPerSecond, averageTxDelay);
        module.exports.sendBenchmarkResults(usedGenesisJson, startTime, maxRuntime, runtime, maxRuntimeReached, maxTransactions, maxTransactionsReached, successfulTransactions, txPerSecond, averageTxDelay)
            .then(function () {
                util.printFormatedMessage("KILLING PROCESS");
                process.exit(0); //kill process
            });
    },

    /**
     * Calculate the average delay of transactions (endTimestamp - startTimestamp)
     */
    caculateAverageDelayOfTransactions: function (transactionsTimestampMapStart, transactionsTimestampMapEnd, successfulTransactions) {
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
    printBenchmarkResults: function (usedGenesisJson, startTime, maxRuntime, runtime, maxRuntimeReached, maxTransactions, maxTransactionsReached, successfulTransactions, txPerSecond, averageTxDelay) {
        console.log("\n");
        console.log("----------BENCHMARK RESULT----------");
        console.log("used genesis.json file: " + usedGenesisJson);
        console.log("Starttime: " + startTime);
        console.log("-----------------------------");
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
    sendBenchmarkResults: async function (usedGenesisJson, startTime, maxRuntime, runtime, maxRuntimeReached, maxTransactions, maxTransactionsReached, successfulTransactions, txPerSecond, averageTxDelay) {

        //get IP and Port from storage

        //use REST client to send JSON
        await restClient.logBenchmarkResult(usedGenesisJson, startTime, maxRuntime, runtime, maxRuntimeReached, maxTransactions, maxTransactionsReached, successfulTransactions, txPerSecond, averageTxDelay);

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