
const util = require('./../util/util');
const client = require('./restfulClient/client_local');
const readLastLines = require('read-last-lines');

//get deployed smart contract addresses from local storage folder
//read the two last lines
const scenario = "account";

var smartContractAddresses = [];
const pathToFile = __dirname + "/../../../storage/contract_addresses_local/" + scenario + ".txt";
readLastLines.read(pathToFile, 2)
    .then(function (lines) {
        smartContractAddresses = lines.split("\n").splice(0, 2);
    })
    .then(function () {
        const port = util.readFileSync_lines(__dirname + "/../../../storage/ports/node_port");
        const benchmarkId = Math.round(Math.random() * 1000);
        const approach = 3;

        //TODO loop over IPs (running nodes)--------------------------------------------------------------
        var ip = '127.0.0.1';
        client.startBenchmark(ip, port, scenario, approach, benchmarkId, 100, 10, smartContractAddresses);


    }).catch(function (err) {
        console.log(err.message);
    });