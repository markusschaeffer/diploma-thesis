/**
 * benchmark-lib funcions
 */

var util = require('./../../util/util.js');
var exec = require('child_process').exec;

module.exports = {

    /**
     * Print results of benchmark to stdout
     */
    printBenchmarkResults: function (timepassed, successfullTransactionCounter, txPerSecond, averageDelay) {
        console.log("\n");
        console.log("----------BENCHMARK RESULT----------");
        console.log("Time passed in seconds: " + timepassed);
        console.log("# successfull transactions: " + successfullTransactionCounter);
        console.log("-----------------------------");
        console.log("Transactions per second: " + txPerSecond);
        console.log("Average transaction delay in seonds: " + averageDelay);
        console.log("-----------------------------");
        console.log("\n");
    },

    /**
     * Print the result of the benchmark and terminate the whole process
     */
    printResultAndTerminate: function (terminationText, benchmarkStartTime, successfullTransactionCounter, transactionsTimestampMapStart, transactionsTimestampMapEnd) {
        var timeDifference = Math.abs((new Date() - benchmarkStartTime) / 1000);
        util.printFormatedMessage(terminationText);
        var averageDelay = module.exports.caculateAverageDelayOfTransactions(transactionsTimestampMapStart, transactionsTimestampMapEnd, successfullTransactionCounter);
        module.exports.printBenchmarkResults(timeDifference, successfullTransactionCounter, successfullTransactionCounter / timeDifference, averageDelay);
        process.exit(0);
    },

    /**
     * Print result and stop the process due to max transactions limit reached
     */
    printResultMaxTransactions: function (benchmarkStartTime, successfullTransactionCounter, transactionsTimestampMapStart, transactionsTimestampMapEnd) {
        module.exports.printResultAndTerminate("MAX TRANSACTIONS REACHED: TERMINATING", benchmarkStartTime, successfullTransactionCounter, transactionsTimestampMapStart, transactionsTimestampMapEnd);
    },

    /**
     * Print result and stop the process due to running out of time limit reached
     */
    printResultMaxTime: function (benchmarkStartTime, successfullTransactionCounter, transactionsTimestampMapStart, transactionsTimestampMapEnd) {
        module.exports.printResultAndTerminate("MAX TIME REACHED: TERMINATING", benchmarkStartTime, successfullTransactionCounter, transactionsTimestampMapStart, transactionsTimestampMapEnd);
    },

    /**
     * Calculate the avega delay of transactions (endTimestamp - startTimestamp)
     */
    caculateAverageDelayOfTransactions: function (transactionsTimestampMapStart, transactionsTimestampMapEnd, successfullTransactionCounter) {
        var averageDelay = 0;
        var summedUpDifferences = 0;
        transactionsTimestampMapStart.forEach(function (value, key, map) {
            var endTimestamp = transactionsTimestampMapEnd.get(key);
            var timeDifferenceOfEndAndStart = (endTimestamp - value) / 1000;
            if (!isNaN(timeDifferenceOfEndAndStart))
                summedUpDifferences += timeDifferenceOfEndAndStart
        });
        averageDelay = summedUpDifferences / successfullTransactionCounter;
        return averageDelay;
    },

    /**
     * get the geth process id (implies a running geth process)
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
     * get the amount of open file descriptors of the system for a specifc process id
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