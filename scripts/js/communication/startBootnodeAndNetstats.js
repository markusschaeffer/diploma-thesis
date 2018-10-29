/**
 * Script for starting a bootnode and eth-netstats on a remote instance
 * 
 * Note:    config/ips/bootnode_ip.txt and config/ports/bootnode_port.txt 
 *          holds information of the ip and port for the bootnode and eth-netstas node
 * 
 */

const util = require('./../util/util');
const client = require('./restfulClient/client_master');

const pathToRootFolder = __dirname + "/../../../";
const ip = util.readFileSync_lines(pathToRootFolder + "config/ips/bootnode_ip.txt")[0];
const port = util.readFileSync_lines(pathToRootFolder + "config/ports/bootnode_port.txt")[0];

client.startBootnode(ip, port);
client.startNetstats(ip, port);