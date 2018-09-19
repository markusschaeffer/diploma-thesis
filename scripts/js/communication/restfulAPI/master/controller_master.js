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
    var jsonRequest = req.body;
    console.log(jsonRequest);

    let newBenchmarkLog = new BenchmarkLog(req.body);
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
        var filePath = pathToRootFolder + "storage/ips/nodes_ip.txt";
        util.appendToFile(filePath, jsonRequest.ip);
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