/*
 * Database Model for MongoDB Schema
 *
 * https://medium.com/ph-devconnect/build-your-first-restful-api-with-node-js-e701b53d1f41
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//schema creation
let BenchmarkLogSchema = new Schema({
    ip: {type: String},
    benchmarkID: {type: Number},
    scenario: {type: String},
    approach: {type: Number},
    instanceType: {type: String},
    nodes: {type: Number},
    peerCount: {type: Number},
    hashRate: {type: Number},
    usedGenesisJson: {type: String},
    targetGasLimit: {type: Number},
    miners: {type: Number},
    mining: {type: Boolean},
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