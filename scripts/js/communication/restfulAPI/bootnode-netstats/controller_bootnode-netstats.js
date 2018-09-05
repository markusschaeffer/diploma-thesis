/**
 * REST Controller (bootnode-netstats)
 */

const exec = require('child_process').exec;
const util = require('./../../../util/util.js');
const publicIp = require('public-ip');

const pathToRootFolder = __dirname + "/../../../../../";

/**
 * starts a bootnode
 */
exports.startBootnode = (req, res) => {

    var ip;
    publicIp.v4().then(function (_ip) {
        ip = _ip;
    }).then(function () {
        util.printFormatedMessage(ip + ": RECEIVED startBootnode REQUEST");

        try {
            var child = exec("cd " + pathToRootFolder + "; make bootnode;");
            // attach listeners to the stdout and stderr.
            child.stdout.on('data', function (data) {
                console.log(data);
            });
            child.stderr.on('data', function (data) {
                console.log(data);
            });
            child.on('close', function (close) {
                console.log(close);
            });

            res.end(JSON.stringify({
                bootnodeStarted: true
            }));
        } catch (e) {
            res.end(JSON.stringify({
                bootnodeStarted: false
            }));
        }
    })
};

/**
 * starts the eth-netstats service
 */
exports.startNetstats = (req, res) => {

    var ip;
    publicIp.v4().then(function (_ip) {
        ip = _ip;
    }).then(function () {
        util.printFormatedMessage(ip + ": RECEIVED startNetstats REQUEST");

        try {
            var child = exec("cd " + pathToRootFolder + "; make netstats;");
            //attach listeners to the stdout and stderr.
            child.stdout.on('data', function (data) {
                console.log(data);
            });
            child.stderr.on('data', function (data) {
                console.log(data);
            });
            child.on('close', function (close) {
                console.log(close);
            });

            res.end(JSON.stringify({
                netstatsStarted: true
            }));
        } catch (e) {
            res.end(JSON.stringify({
                netstatsStarted: false
            }));
        }
    })
};