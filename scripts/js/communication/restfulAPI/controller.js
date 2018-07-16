/**
 * REST Controller
 */

//TODO add model https://medium.com/ph-devconnect/build-your-first-restful-api-with-node-js-e701b53d1f41
//const mongoose = require("mongoose");
//const Task = mongoose.model("Tasks");

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

exports.logBenchmark = (req, res) => {

    util.printFormatedMessage("RECEIVED BENCHMARK LOG REQUEST");

    var jsonRequest = req.body;
    console.log(jsonRequest);

    //store results to database here
    //database for selecting parameters more easily via SQL?

    res.end(JSON.stringify("OK"));
};