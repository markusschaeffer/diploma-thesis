/**
 * REST Controller
 */

const mongoose = require("mongoose");
const BenchmarkLog = mongoose.model("BenchmarkLog");
var util = require('./../../util/util.js');

//instantiate web3
var Web3 = require('web3');
var web3 = new Web3();

//set providers from Web3.providers
var httpPort = 8100;
var httpProviderString = "http://localhost:" + httpPort; //TODO change for benchmark on ec2 instances
//http provider (node-0 PORT 8100, node-1 PORT 8101)
web3 = new Web3(new Web3.providers.HttpProvider(httpProviderString));

exports.getPeerCount = (req, res) => {

    util.printFormatedMessage("RECEIVED PEER COUNT REQUEST");
    var peerCount = -1;
    web3.eth.net.getPeerCount()
        .then(function (returnedPeerCount) {
            console.log("Peer Count is: "+ returnedPeerCount);
            peerCount = returnedPeerCount;
            res.end(JSON.stringify(peerCount));
        }).catch((err) => {
            console.log(err);
            res.end(JSON.stringify(peerCount));
        });
};

exports.deployContract = (req, res) => {

    util.printFormatedMessage("RECEIVED CONTRACT DEPLOYMENT REQUEST");

    var jsonRequest = req.body;
    console.log(jsonRequest);

    //start execution of scripts to run here

    res.end(JSON.stringify("OK"));
};

exports.startBenchmark = (req, res) => {

    util.printFormatedMessage("RECEIVED BENCHMARK START REQUEST");

    var jsonRequest = req.body;
    console.log(jsonRequest);

    //start execution of scripts to run here

    res.end(JSON.stringify("OK"));
};

/**
 * Stores a benchmark-log-result to the database
 */
exports.logBenchmark = (req, res) => {

    util.printFormatedMessage("RECEIVED BENCHMARK LOG REQUEST");
    var jsonRequest = req.body;
    console.log(jsonRequest);

    let newBenchmarkLog = new BenchmarkLog(req.body);
    util.printFormatedMessage("TRYING TO SAVE BENCHMARK LOG RESULT TO DB");
    newBenchmarkLog.save((err, result) => {
        if (err)
            res.send(err);
        console.log("Result:" + result);
        //res.json(result);
        res.end(JSON.stringify("OK"));
    });
};