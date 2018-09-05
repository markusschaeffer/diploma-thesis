
const util = require('./../util/util');
const client = require('./restfulClient/client_master');
const readLastLines = require('read-last-lines');

//TODO use CLI arguments for scenario, maxTransactions and maxRuntime --------------------------------------
const scenario = "account";

const pathToRootFolder = __dirname + "/../../../";
const pathToFile = pathToRootFolder + "storage/contract_addresses_local/" + scenario + ".txt";
var smartContractAddresses = [];

//get deployed smart contract addresses from local storage folder
//read the two last lines
readLastLines.read(pathToFile, 2)
    .then(function (lines) {
        smartContractAddresses = lines.split("\n").splice(0, 2);
    })
    .then(function () {
        const port = util.readFileSync_lines(pathToRootFolder + "storage/ports/node_port");
        const benchmarkId = Math.round(Math.random() * 1000);
        const approach = 3;

        //TODO loop over IPs (running nodes)--------------------------------------------------------------
        var ip = '127.0.0.1';
        client.startBenchmark(ip, port, scenario, approach, benchmarkId, 100, 10, smartContractAddresses);


    }).catch(function (err) {
        console.log(err.message);
    });