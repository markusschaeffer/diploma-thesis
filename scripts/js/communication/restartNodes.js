/**
 * Script for restarting nodes via REST API
 * 
 */

const util = require('./../util/util');
const client = require('./restfulClient/client_master');

const pathToRootFolder = __dirname + "/../../../";
const ips = util.readFileSync_lines(pathToRootFolder + "storage/ips/nodes_ip.txt");
const port = util.readFileSync_lines(pathToRootFolder + "storage/ports/node_port.txt")[0];
const genesis = util.readFileSync_lines(pathToRootFolder + "storage/current_genesis/current_genesis.txt")[0];

util.printFormatedMessage(genesis);

for (var i = 0; i <= ips.length - 1; i++) {
    client.restartNode(ips[i], port, genesis);
}