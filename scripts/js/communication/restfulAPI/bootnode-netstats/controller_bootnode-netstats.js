/**
 * REST Controller (bootnode-netstats)
 */

const spawn = require('child_process').spawn;
const util = require('./../../../util/util.js');
const publicIp = require('public-ip');

const pathToRootFolder = __dirname + "/../../../../../";

/**
 * starts a bootnode service
 */
exports.startBootnode = (req, res) => {

    var ip;
    publicIp.v4().then(function (_ip) {
        ip = _ip;
    }).then(function () {
        util.printFormatedMessage(ip + ": RECEIVED startBootnode REQUEST");

        try {
            //start bootnode
            var child = spawn("cd " + pathToRootFolder + "; make bootnode;", {
                stdio: 'inherit',
                shell: true
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
            //start netstats
            var child = spawn("cd " + pathToRootFolder + "; make netstats;", {
                stdio: 'inherit',
                shell: true
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