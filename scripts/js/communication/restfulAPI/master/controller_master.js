/**
 * REST Controller (master)
 */

const mongoose = require("mongoose");
const BenchmarkLog = mongoose.model("BenchmarkLog");
const util = require('./../../../util/util.js');
const pathToRootFolder = __dirname + "/../../../../../";

/**
 * stores a benchmark-log-result to the database
 */
exports.logBenchmark = (req, res) => {

    util.printFormatedMessage("RECEIVED logBenchmark REQUEST");

    //get amount of nodes and miners in the network from storage
    var nodes = 0;
    var miners = 0;

    const ips = util.readFileSync_lines(pathToRootFolder + "storage/ips/nodes_ip.txt");
    const miningSettings = util.readFileSync_lines(pathToRootFolder + "storage/mining_settings/mining.txt");

    nodes = ips.length;
    for (var i = 0; i <= miningSettings.length - 1; i++) {
        if (miningSettings[i] == "true")
            miners++;
    }
    
    let newBenchmarkLog = new BenchmarkLog({
        ip: req.body.ip,
        benchmarkID: req.body.benchmarkID,
        scenario: req.body.scenario,
        approach: req.body.approach,
        instanceType: req.body.instanceType,
        nodes: nodes,
        peerCount: req.body.peerCount,
        hashRate: req.body.hashRate,
        usedGenesisJson: req.body.usedGenesisJson,
        targetGasLimit: req.body.targetGasLimit,
        miners: miners,
        mining: req.body.mining,
        startTime: req.body.startTime,
        maxRuntime: req.body.maxRuntime,
        runtime: req.body.runtime,
        maxRuntimeReached: req.body.maxRuntimeReached,
        maxTransactions: req.body.maxTransactions,
        maxTransactionsReached: req.body.maxTransactionsReached,
        successfulTransactions: req.body.successfulTransactions,
        txPerSecond: req.body.txPerSecond,
        averageDelay: req.body.averageDelay,
    });

    util.printFormatedMessage("TRYING TO SAVE BENCHMARK LOG RESULT TO DB");
    newBenchmarkLog.save((err, result) => {
        if (err)
            res.send(err);
        console.log("Result:" + result);
        res.end(JSON.stringify("OK"));
    });
};

/**
 * stores contract addresses to the storage folder
 */
exports.storeContractAddress = (req, res) => {

    util.printFormatedMessage("RECEIVED storeContractAddress REQUEST");
    var jsonRequest = req.body;
    console.log(jsonRequest);

    try {
        if (jsonRequest.scenario != null) {
            var filePath;
            switch (jsonRequest.scenario) {
                case 'account':
                    filePath = pathToRootFolder + "storage/contract_addresses_local/account.txt";
                    util.saveContractAddress(filePath, jsonRequest.address);
                    break;
                case 'ballot':
                    filePath = pathToRootFolder + "storage/contract_addresses_local/ballot.txt";
                    util.saveContractAddress(filePath, jsonRequest.address);
                    break;
                case 'readWrite':
                    filePath = pathToRootFolder + "storage/contract_addresses_local/readWrite.txt";
                    util.saveContractAddress(filePath, jsonRequest.address);
                    break;
                default:
                    new Error("Scenario could not be matched -  use account, ballot or readWrite");
            }
        }
        res.end(JSON.stringify("OK"));
    } catch (error) {
        console.log(error);
        res.end(JSON.stringify("NOT OKAY - address could not be stored"));
    }
};

/**
 * stores node IP to the storage folder
 */
exports.storeNodeIP = (req, res) => {

    util.printFormatedMessage("RECEIVED storeNodeIP REQUEST");
    var jsonRequest = req.body;
    console.log(jsonRequest);

    try {
        //add IP of node to local list of node IPs
        const filePathNodesIP = pathToRootFolder + "storage/ips/nodes_ip.txt";
        util.appendToFile(filePathNodesIP, jsonRequest.ip);

        //set default mining/sealing configuration for node
        const filePathMiningSetting = pathToRootFolder + "storage/mining_settings/mining.txt";
        util.appendToFile(filePathMiningSetting, "true");

        //set default benchmark setting (start benchmark on node)
        const filePathBenchmarkStartSetting = pathToRootFolder + "storage/benchmark_settings/benchmark_start.txt";
        util.appendToFile(filePathBenchmarkStartSetting, "true");

        res.end(JSON.stringify("OK"));
    } catch (error) {
        console.log(error);
        res.end(JSON.stringify("NOT OKAY - IP could not be stored"));
    }
};

/**
 * stores bootnode IP to the storage folder
 */
exports.storeBootnodeIP = (req, res) => {

    util.printFormatedMessage("RECEIVED storeBootnodeIP REQUEST");
    var jsonRequest = req.body;
    console.log(jsonRequest);

    try {
        var filePath = pathToRootFolder + "storage/ips/bootnode_ip.txt";
        util.appendToFile(filePath, jsonRequest.ip);
        res.end(JSON.stringify("OK"));
    } catch (error) {
        console.log(error);
        res.end(JSON.stringify("NOT OKAY - IP could not be stored"));
    }
};


/**
 * stores netstats IP to the storage folder
 */
exports.storeNetstatsIP = (req, res) => {

    util.printFormatedMessage("RECEIVED storeNetstatsIP REQUEST");
    var jsonRequest = req.body;
    console.log(jsonRequest);

    try {
        var filePath = pathToRootFolder + "storage/ips/netstats_ip.txt";
        util.appendToFile(filePath, jsonRequest.ip);
        res.end(JSON.stringify("OK"));
    } catch (error) {
        console.log(error);
        res.end(JSON.stringify("NOT OKAY - IP could not be stored"));
    }
};