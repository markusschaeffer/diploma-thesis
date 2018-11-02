/**
 * Script for deployment of Smart Contract scenarios via REST API
 * 
 * Note:    The first node specified in storage/ips/nodes_ip acts 
 *          as provider for the deployment of the smart contracts
 * 
 * process.argv[2]: scenario-name (e.g. account or ballot)
 * 
 */

const util = require('./../util/util');
const client = require('./restfulClient/client_master');

const pathToRootFolder = __dirname + "/../../../";
const ip = util.readFileSync_lines(pathToRootFolder + "storage/ips/nodes_ip.txt")[0];
const port = util.readFileSync_lines(pathToRootFolder + "config/ports/node_port.txt")[0];

var scenario = process.argv[2];
if (scenario == undefined) scenario = "account";

util.printFormatedMessage("INITIALISING BENCHMARK QUEUE");
//initialize benchmark queue with benchmark_settings/benchmark_size.txt
const benchmark_size = util.readFileSync_lines(pathToRootFolder + "config/benchmark_settings/benchmark_size.txt")[0];
util.writeToFile(pathToRootFolder + "storage/benchmark_queue/benchmark_queue.txt", benchmark_size);

switch (scenario) {
    case 'account':
        client.deployContract(ip, port, "account");
        break;
    case 'ballot':
        client.deployContract(ip, port, "ballot");
        break;
    default:
        throw new Error("Unknown Scenario - use account or ballot");
}