/**
 * Script for querying the peerCount of each node via REST API
 * 
 * Note:    storage/ips/nodes_ip.txt and config/ports/nodes_port.txt 
 *          holds information of IPs and port of the nodes
 * 
 */

const client = require('./restfulClient/client_master');
const util = require('./../util/util');

const pathToRootFolder = __dirname + "/../../../";
const port = util.readFileSync_lines(pathToRootFolder + "config/ports/node_port.txt")[0];
var ips = util.readFileSync_lines(pathToRootFolder + "storage/ips/nodes_ip.txt");

for (var i = 0; i <= ips.length - 1; i++) {
    client.getPeerCount(ips[i], port);
}