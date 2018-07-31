/*
 * Benchmark for sending Ether between two Contracts (see deployment folder)
 */

var util = require('./../util/util.js');
var benchmarkLib = require('./benchmark-lib/benchmark-lib.js');
var timestamp = require('time-stamp');

//instantiate web3
var Web3 = require('web3');
var web3 = new Web3();

//set providers from Web3.providers
var httpPort = process.argv[2]; //get port as cli parameter
var httpProviderString = "http://localhost:" + httpPort; //TODO change for benchmark on ec2 instances
//http provider (node-0 PORT 8100, node-1 PORT 8101)
web3 = new Web3(new Web3.providers.HttpProvider(httpProviderString));

const usedGenesisJson = process.argv[3];
const maxTransactions = process.argv[4];
const maxRuntime = process.argv[5] * 1000 * 60;
const maxOpenFileDescriptors = 1024;
const gasPrice = '20000000000'; // default gas price in wei, 20 gwei in this case

var transactionsTimestampMapStart = new Map();
var transactionsTimestampMapEnd = new Map();
var successfulTransactions = 0;
var promises = [];
var sentTransactions = 0;
var startTime;

//specify which account to use for gas costs for each transaction
const accountAddress = "0x5dfe021f45f00ae83b0aa963be44a1310a782fcc";

//get deployed smart contract addresses from a local file in folder storage
var contract1Address = "";
var contract2Address = "";
var filePath = "./../../../storage/contract_addresses/account.txt";
var addresses = util.readFileSync_lines(filePath);
if ((addresses.length - 1) >= 2) {
  contract1Address = addresses[0];
  contract2Address = addresses[1];
} else
  throw new Error('Could not read at least 2 Smart Contract addresses');

//get contract ABI from local .abi file
var filePath_abi = "./../../../smart_contracts/account/target/Account.abi";
var abiArrayString = util.readFileSync_full(filePath_abi);
var abiArray = JSON.parse(abiArrayString);

var contract1 = new web3.eth.Contract(abiArray, contract1Address, {
  gasPrice: gasPrice
});
contract1.options.address = contract1Address;

var contract2 = new web3.eth.Contract(abiArray, contract2Address, {
  gasPrice: gasPrice
});
contract2.options.address = contract2Address;

var amountTobeSent = web3.utils.toWei('1', "ether"); //amount to be send for each transaction

benchmarkLib.getGethProcessId()
  .then(function (gethPID) {
    runBenchmark(gethPID, maxTransactions, maxRuntime);
  });

async function runBenchmark(gethPID, maxTransactions, maxRuntime) {
  startTime = new Date();
  util.printFormatedMessage("BENCHMARK STARTED");

  setTimeout(function () {
    benchmarkLib.logBenchmarkResult(usedGenesisJson, startTime, maxRuntime, true, maxTransactions, false, successfulTransactions, transactionsTimestampMapStart, transactionsTimestampMapEnd);
  }, maxRuntime);

  for (var i = 1; i <= maxTransactions; i++) {
    await benchmarkLib.getAmountOfOpenFileDescriptorsForPID(gethPID)
      .then(function (amountOfOpenFileDescriptors) {
        if (amountOfOpenFileDescriptors <= maxOpenFileDescriptors)
          promises.push(handleTransaction(i));
      });
  }

  Promise.all(promises.map(p => p.catch(() => undefined))).
  then(function () {
    benchmarkLib.logBenchmarkResult(usedGenesisJson, startTime, maxRuntime, false, maxTransactions, true, successfulTransactions, transactionsTimestampMapStart, transactionsTimestampMapEnd);
  }, function (err) {
    console.log(err);
  });
}

function handleTransaction(transactionNumber) {
  return new Promise(function (resolve, reject) {
    sentTransactions++;
    console.log(httpProviderString + ": sending " + transactionNumber + " at " + timestamp('HH:mm:ss:ms'));
    transactionsTimestampMapStart.set(transactionNumber, new Date());

    contract1.methods.transferEther(contract2.options.address, amountTobeSent).send({
        from: accountAddress
      })
      .once('transactionHash', function (hash) {
        console.log(httpProviderString + ": received transaction hash " + transactionNumber + " at " + timestamp('HH:mm:ss:ms'));
      })
      .on('receipt', function (receipt) {
        successfulTransactions++;
        transactionsTimestampMapEnd.set(transactionNumber, new Date());
        console.log(httpProviderString + ": finished " + transactionNumber + " at " + timestamp('HH:mm:ss:ms'));
        return resolve(receipt);
      })
      .on('error', function (error) {
        console.log(error);
        return reject(error);
      });
  });
}