/**
 * benchmark-lib funcions
 */

var util = require('./../util/util.js');
var exec = require('child_process').exec;

module.exports = {
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