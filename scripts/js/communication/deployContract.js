/**
 * Script for deployment of Smart Contract scenarios via REST interface
 * Scenario will be deployed at the first node/ip specified in /storage/ips/nodes_ip
 * 
 * process.argv[2]: scenario-name (e.g. account, ballot or readWrite)
 * 
 */

const util = require('./../util/util');
const client = require('./restfulClient/client_local');

//deploy on first IP in nodes_ip from /storage
const ip = util.readFileSync_lines(__dirname + "/../../../storage/ips/nodes_ip")[0];
const port = util.readFileSync_lines(__dirname + "/../../../storage/ports/node_port");

const scenario = "account"; //TODO - delete ---------------------------------------
//const scenario = process.argv[2];

switch (scenario) {
    case 'account':
        client.deployContract(ip, port, "account");
        break;
    case 'ballot':
        client.deployContract(ip, port, "ballot");
        break;
    case 'readWrite':
        client.deployContract(ip, port, "readWrite");
        break;
    default:
        throw new Error("Unknown Scenario - use account, ballot or readWrite");
        break;
}