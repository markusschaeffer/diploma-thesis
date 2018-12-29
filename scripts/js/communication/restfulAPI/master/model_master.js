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
    docker: {type: Boolean},
    nodes: {type: Number},
    peerCount: {type: Number},
    targetGasLimit: {type: Number},
    gasLimit: {type: Number},
    gasLimit_genesis_hex: {type: String},
    gasLimit_genesis_dec: {type: Number},
    usedGenesisJson: {type: String},
    clique: {type: Boolean},
    clique_period: {type: Number},
    ethash: {type: Boolean},
    mining: {type: Boolean},
    miningOnFullWorkload: {type: Boolean},
    hashRate: {type: Number},
    miners: {type: Number},
    difficulty: {type: Number},
    difficulty_genesis_hex: {type: String},
    difficulty_genesis_dec: {type: Number},
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