/*
You’ll need to have MongoDB server installed locally, if you want to serve your database.
https://medium.com/ph-devconnect/build-your-first-restful-api-with-node-js-e701b53d1f41
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//schema creation
let BenchmarkLogSchema = new Schema({
    usedGenesisJson: {type: String},
    startTime: {type: Date},
    maxRuntime: {type: Number},
    runtime: {type: Number},
    maxRuntimeReached: {type: Boolean},
    maxTransactions: {type: Number},
    maxTransactionsReached: {type: Boolean},
    successfulTransactions: {type: Number},
    txPerSecond: {type: Number},
    averageDelay: {type: Number}
});

//compiling schema to a model
module.exports = mongoose.model('BenchmarkLog', BenchmarkLogSchema);