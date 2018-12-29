/**
 * Prints difficulty and gasLimit of last block
 * 
 */

const util = require('./util.js');
const pathToRootFolder = __dirname + "/../../../";

//instantiate web3
const Web3 = require('web3');
var web3 = new Web3();

const ip = "localhost";
//get CLI parameters
const gethHttpPort = util.readFileSync_full(pathToRootFolder + "config/ports/geth_http_port_node0.txt");
const gasPrice = '20000000000';

//set providers from Web3.providers
const httpProviderString = "http://" + ip + ":" + gethHttpPort;
//http provider (node-0 PORT 8100, node-1 PORT 8101)
web3 = new Web3(new Web3.providers.HttpProvider(httpProviderString));

web3.eth.getBlock("latest").then(function (block) {
    console.log(block.difficulty);
    console.log(block.gasLimit);
});