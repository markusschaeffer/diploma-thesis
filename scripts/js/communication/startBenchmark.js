/**
 * Script for starting benchmarks via REST API
 * 
 * Note:    config/ips/nodes_ip.txt and config/ports/nodes_port.txt 
 *          holds information of IPs and port of the nodes
 * 
 * process.argv[2]: scenario (account, ballot, readWrite)
 * process.argv[3]: approach (1-3)
 * process.argv[4]: maxTransactions (e.g. 1-10000)
 * process.argv[5]: maxRuntime (maxRuntime in minutes, e.g. 10)
 */
const commLib = require('./communication-lib');
const util = require('./../util/util');
const pathToRootFolder = __dirname + "/../../../";

var scenario = process.argv[2];
var approach = process.argv[3];
var maxTransactions = process.argv[4];
var maxRuntime = process.argv[5];

//default values for cli arguments
if (scenario == undefined) scenario = "account";
if (approach == undefined) approach = 3;
if (maxTransactions == undefined) maxTransactions = 1000;
if (maxRuntime == undefined) maxRuntime = 5;

//startBenchmark
commLib.startBenchmark(scenario, approach, maxTransactions, maxRuntime);

//decrease benchmark queue
util.writeToFile(pathToRootFolder + "storage/temp/benchmark_queue.txt",
    parseInt(util.readFileSync_lines(pathToRootFolder + "storage/temp/benchmark_queue.txt")[0]) - 1);