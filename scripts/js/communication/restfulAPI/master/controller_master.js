/**
 * REST Controller (local)
 */

const mongoose = require("mongoose");
const BenchmarkLog = mongoose.model("BenchmarkLog");
const util = require('./../../../util/util.js');

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