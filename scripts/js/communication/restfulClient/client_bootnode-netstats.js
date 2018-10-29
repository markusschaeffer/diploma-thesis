/**
 * Client (bootnode-netstats) for REST communication
 */

var util = require('./../../util/util');
var clientUtil = require('./clientUtil');

const pathToRootFolder = __dirname + "/../../../../";
const masterIP = util.readFileSync_lines(pathToRootFolder + "config/ips/master_ip.txt")[0];
const port = util.readFileSync_lines(pathToRootFolder + "config/ports/master_port.txt")[0];

module.exports = {

    sendBootnodeIP: async function (ip) {
        util.printFormatedMessage("SENDING sendBootnodeIP REQUEST");

        let options = {
            method: 'POST',
            uri: 'http://' + masterIP + ':' + port + '/master-store-ip-bootnode',
            body: {
                ip: ip
            },
            json: true
        };

        await clientUtil.sendRequest(options);
    },

    sendNetstatsIP: async function (ip) {
        util.printFormatedMessage("SENDING sendNetstatsIP REQUEST");

        let options = {
            method: 'POST',
            uri: 'http://' + masterIP + ':' + port + '/master-store-ip-netstats',
            body: {
                ip: ip
            },
            json: true
        };

        await clientUtil.sendRequest(options);
    }
}