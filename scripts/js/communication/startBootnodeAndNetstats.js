/**
 * Script for starting a bootnode and eth-netstats on a remote instance
 * 
 */

const util = require('./../util/util');
const client = require('./restfulClient/client_master');

const pathToRootFolder = __dirname + "/../../../";
const ip = util.readFileSync_lines(pathToRootFolder + "storage/ips/bootnode_ip");
const port = util.readFileSync_lines(pathToRootFolder + "storage/ports/bootnode_port");

client.startBootnode(ip, port);
client.startNetstats(ip, port);