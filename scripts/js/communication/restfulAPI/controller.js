/**
 * REST Controller
 */

//TODO add model https://medium.com/ph-devconnect/build-your-first-restful-api-with-node-js-e701b53d1f41
const mongoose = require("mongoose");
const BenchmarkLog = mongoose.model("BenchmarkLog");

var util = require('./../../util/util.js');

exports.getPeersCount = (req, res) => {

    util.printFormatedMessage("RECEIVED PEERS COUNT REQUEST");

    var jsonRequest = req.body;
    console.log(jsonRequest);

    //start execution of scripts to run here

    res.end(JSON.stringify("OK"));
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
    newBenchmarkLog.save( (err, result) => {
        if (err)
            res.send(err);
        console.log("Result:" + result);
        //res.json(result);
        res.end(JSON.stringify("OK"));
    });
};