/**
 * REST Controller (master)
 */

const mongoose = require("mongoose");
const BenchmarkLog = mongoose.model("BenchmarkLog");
const exec = require('child_process').exec;

const pathToRootFolder = __dirname + "/../../../../../";
const util = require('./../../../util/util.js');
const commLib = require(pathToRootFolder + "scripts/js/communication/communication-lib.js");

/**
 * stores a benchmark-log-result to the database
 */
exports.logBenchmark = (req, res) => {

    util.printFormatedMessage("RECEIVED logBenchmark REQUEST");

    //get amount of nodes in the network from storage
    var nodes = 0;
    const ips = util.readFileSync_lines(pathToRootFolder + "storage/ips/nodes_ip.txt");
    nodes = ips.length;

    //get amount of miners in the network from config
    var miners = 0;
    const miningSettings = util.readFileSync_lines(pathToRootFolder + "storage/mining_settings/mining.txt");
    for (var i = 0; i <= miningSettings.length - 1; i++) {
        if (miningSettings[i] == "true")
            miners++;
    }

    //get docker environment variable
    const docker = util.readFileSync_lines(pathToRootFolder + "config/environment/docker.txt")[0];

    //read parameters from usedGenesisJson
    var genesisJson = require(pathToRootFolder + "genesis_json_files/" + req.body.usedGenesisJson);
    var clique = false;
    var clique_period = 0;
    var ethash = false;
    var difficulty_string_hex = "";
    var difficulty_int_dec = 0;
    var gasLimit_string_hex = "";
    var gasLimit_int_dec = 0;

    for (var key in genesisJson) {

        if (key == "config") {
            for (var keykey in genesisJson[key]) {
                if (keykey == "ethash") {
                    ethash = true;
                    clique = false;
                }
                if (keykey == "clique") {
                    ethash = false;
                    clique = true;
                    for (var keykeykey in genesisJson[key][keykey]) {
                        if (keykeykey == "period")
                            clique_period = parseInt(genesisJson[key][keykey][keykeykey], 10);
                    }
                }
            }
        }

        if (key == "gasLimit") {
            gasLimit_string_hex = genesisJson[key];
            gasLimit_int_dec = parseInt(gasLimit_string_hex, 16);
        }

        if (key == "difficulty") {
            difficulty_string_hex = genesisJson[key];
            difficulty_int_dec = parseInt(difficulty_string_hex, 16);
        }
    }

    let newBenchmarkLog = new BenchmarkLog({
        ip: req.body.ip,
        benchmarkID: req.body.benchmarkID,
        scenario: req.body.scenario,
        approach: req.body.approach,
        instanceType: req.body.instanceType,
        docker: docker,
        nodes: nodes,
        peerCount: req.body.peerCount,
        targetGasLimit: req.body.targetGasLimit,
        gasLimit: req.body.gasLimit,
        gasLimit_genesis_hex: gasLimit_string_hex,
        gasLimit_genesis_dec: gasLimit_int_dec,
        usedGenesisJson: req.body.usedGenesisJson,
        clique: clique,
        clique_period: clique_period,
        ethash: ethash,
        mining: req.body.mining,
        miningOnFullWorkload: req.body.miningOnFullWorkload,
        hashRate: req.body.hashRate,
        miners: miners,
        difficulty: req.body.difficulty,
        difficulty_genesis_hex: difficulty_string_hex,
        difficulty_genesis_dec: difficulty_int_dec,
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

        //initiate next Benchmark if there is any left in the queue
        module.exports.initiateNextBenchmark(req.body.scenario, req.body.approach, req.body.maxTransactions, (req.body.maxRuntime / 60));
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
                default:
                    new Error("Scenario could not be matched -  use account or ballot");
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

/**
 * initiate next benchmark if there is any left in storage/benchmark_queue/benchmark_queue.txt
 */
exports.initiateNextBenchmark = function (scenario, approach, maxTransactions, maxRuntime) {
    try {
        //read amount of benchmarks left from benchmark queue from storage/benchmark_queue/
        benchmarkQueue = parseInt(util.readFileSync_lines(pathToRootFolder + "storage/benchmark_queue/benchmark_queue.txt")[0], 10);
        if (benchmarkQueue > 0) {
            new Promise(function (resolve, reject) {
                //startBenchmark
                var child = exec("cd " + pathToRootFolder + "scripts/js/communication; node startBenchmark.js " +
                    scenario + " " + approach + " " + maxTransactions + " " + maxRuntime,
                    function (error, stdout, stderr) {
                        resolve(stdout);
                        if (error !== null)
                            reject(error);
                    });
                // attach listeners to the stdout and stderr.
                exports.attachListeners(child);
            });
        }
    } catch (err) {
        console.error(err);
        console.error("Error at starting next benchmark")
    }
}

exports.attachListeners = function (child) {
    child.stdout.on('data', function (data) {
        console.log(data);
    });
    child.stderr.on('data', function (data) {
        console.log(data);
    });
    child.on('close', function (close) {
        console.log(close);
    });
};