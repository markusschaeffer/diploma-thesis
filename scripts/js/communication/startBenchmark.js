var client = require('./restfulClient/client_local');
const readLastLines = require('read-last-lines');

//get deployed smart contract addresses from local storage folder
//read the two last lines
const scenario = "account";

var smartContractAddresses = [];
var pathToFile = __dirname + "/../../../storage/contract_addresses_local/" + scenario + ".txt";
readLastLines.read(pathToFile, 2)
    .then(function (lines) {
        smartContractAddresses = lines.split("\n").splice(0, 2);
    })
    .then(function () {
        //TODO loop over IPs (running nodes)--------------------------------------------------------------
        client.startBenchmark('127.0.0.1', 8999, scenario, 100, 10, smartContractAddresses);
    }).catch(function (err) {
        console.log(err.message);
    });