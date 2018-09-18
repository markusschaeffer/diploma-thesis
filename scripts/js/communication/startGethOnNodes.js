/**
 * Script for starting geth client on nodes via REST API
 * 
 */

const util = require('./../util/util');
const client = require('./restfulClient/client_master');

const pathToRootFolder = __dirname + "/../../../";
const ips = util.readFileSync_lines(pathToRootFolder + "storage/ips/nodes_ip.txt");
const port = util.readFileSync_lines(pathToRootFolder + "storage/ports/node_port.txt")[0];
const genesis = util.readFileSync_lines(pathToRootFolder + "storage/current_genesis/current_genesis.txt")[0];
const targetGasLimit = util.readFileSync_lines(pathToRootFolder + "storage/mining_settings/target_gas_limit.txt")[0];
const instanceType = util.readFileSync_lines(pathToRootFolder + "storage/instance_settings/instance_type.txt")[0];
const masterIP = util.readFileSync_lines(pathToRootFolder + "storage/ips/master_ip.txt")[0];
const bootnodeIP = util.readFileSync_lines(pathToRootFolder + "storage/ips/bootnode_ip.txt")[0];
const netstatsIP = util.readFileSync_lines(pathToRootFolder + "storage/ips/netstats_ip.txt")[0];

for (var i = 0; i <= ips.length - 1; i++) {
    var mining = true;
    client.startGeth(ips[i], port, genesis, targetGasLimit, mining, instanceType, masterIP, bootnodeIP, netstatsIP);
}