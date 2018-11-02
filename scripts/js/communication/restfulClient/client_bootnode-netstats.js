/**
 * Client (bootnode-netstats) for REST communication
 */

var util = require('./../../util/util');
var clientUtil = require('./clientUtil');

const pathToRootFolder = __dirname + "/../../../../";
const master_rest_port = util.readFileSync_lines(pathToRootFolder + "config/ports/master_port.txt")[0];

module.exports = {

    /**
     * Register IP at master node
     */
    sendBootnodeIP: async function (master_ip, own_ip) {
        util.printFormatedMessage("SENDING sendBootnodeIP REQUEST");

        let options = {
            method: 'POST',
            uri: 'http://' + master_ip + ':' + master_rest_port + '/master-store-ip-bootnode',
            body: {
                ip: own_ip
            },
            json: true
        };

        await clientUtil.sendRequest(options);
    },

    /**
     * Register IP at master node
     */
    sendNetstatsIP: async function (master_ip, own_ip) {
        util.printFormatedMessage("SENDING sendNetstatsIP REQUEST");

        let options = {
            method: 'POST',
            uri: 'http://' + master_ip + ':' + master_rest_port + '/master-store-ip-netstats',
            body: {
                ip: own_ip
            },
            json: true
        };

        await clientUtil.sendRequest(options);
    }
}