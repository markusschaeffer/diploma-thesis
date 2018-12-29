/*
 * Benchmark for sending Ether between two Contracts (see deployment folder)
 * 
 * argv[2] : httpPort
 * argv[3] : maxTransactions
 * argv[4] : maxRuntime
 * argv[5] : smartContract address 1
 * argv[6] : smartContract address 2
 * argv[7] : benchmarkID
 * argv[8] : miningOnFullWorkload
 */

const util = require('./../util/util.js');
const benchmarkLib = require('./benchmark-lib/benchmark-lib.js');
const timestamp = require('time-stamp');
const pathToRootFolder = __dirname + "/../../../";

//instantiate web3
const Web3 = require('web3');
var web3 = new Web3();

const ip = "localhost";
//get CLI parameters
var httpPort = process.argv[2];
var maxTransactions = process.argv[3];
var maxRuntime = process.argv[4];
var benchmarkID = process.argv[7];
var miningOnFullWorkload = process.argv[8];

//default values
if (httpPort == undefined) httpPort = util.readFileSync_full(pathToRootFolder + "config/ports/geth_http_port_node0.txt");
if (maxTransactions == undefined) maxTransactions = 1000;
if (maxRuntime == undefined) maxRuntime = 10;
if (benchmarkID == undefined) benchmarkID = 0;

const maxRuntimeInSeconds = maxRuntime * 60;
const maxRuntimeInMilliseconds = maxRuntimeInSeconds * 1000;

//set providers from Web3.providers
const httpProviderString = "http://" + ip + ":" + httpPort;
//http provider (node-0 PORT 8100, node-1 PORT 8101)
web3 = new Web3(new Web3.providers.HttpProvider(httpProviderString));

const maxTransactionBatchSize = 100;
// default gas price in wei, 20 gwei in this case
const gasPrice = '20000000000';
//define amount to be sent between contracts
const amountTobeSent = web3.utils.toWei('1', "ether");
util.printFormatedMessage("amountTobeSent " + amountTobeSent);
//specify which account to use for gas costs for each transaction
const accountAddress = util.readFileSync_full(pathToRootFolder + "storage/staticAccount_address/address.txt");
const scenario = "account";
const approach = 3;

var transactionsTimestampMapStart = new Map();
var transactionsTimestampMapEnd = new Map();
var successfulTransactions = 0;
var transactionHashesCount = 0;
var promises = [];
var sentTransaction = 0;
var startTime;

//get contract ABI from local .abi file
var filePath_abi = pathToRootFolder + "smart_contracts/account/target/Account.abi";
var abiArrayString = util.readFileSync_full(filePath_abi);
var abiArray = JSON.parse(abiArrayString);

//get deployed smart contract addresses (via argv or from a local file in folder storage)
if (process.argv[5] != null && process.argv[6] != null) {
  var contract1Address = process.argv[5];
  var contract2Address = process.argv[6];
} else {
  var filePath = pathToRootFolder + "storage/contract_addresses_node/account.txt";
  var addresses = util.readFileSync_lines(filePath);
  var contract1Address = addresses[0];
  var contract2Address = addresses[1];
}

//get contracts
var contract1 = new web3.eth.Contract(abiArray, contract1Address, {
  gasPrice: gasPrice
});
contract1.options.address = contract1Address;
var contract2 = new web3.eth.Contract(abiArray, contract2Address, {
  gasPrice: gasPrice
});
contract2.options.address = contract2Address;

//run benchmark
runBenchmark(maxTransactions, maxRuntimeInSeconds);

async function runBenchmark(maxTransactions, maxRuntime) {
  if (miningOnFullWorkload != "True") {
    startTime = new Date();
    util.printFormatedMessage("BENCHMARK STARTED");
  } else {
    util.printFormatedMessage("BENCHMARK WITH MINING ONLY ON FULL WORKLOAD");
  }

  //set Timeout for maxRuntime
  setTimeout(function () {
    benchmarkLib.logBenchmarkResult(scenario, approach, benchmarkID, startTime, maxRuntime, true, maxTransactions, false, successfulTransactions, transactionsTimestampMapStart, transactionsTimestampMapEnd);
  }, maxRuntimeInMilliseconds);

  //send transaction and measure time needed; send transactions in batches of 100
  var transactionSendingStartTime = new Date();
  for (var i = 1; i <= maxTransactions; i++) {
    promises.push(handleTransaction(i));
    if (sentTransaction % maxTransactionBatchSize == 0) {
      util.printFormatedMessage("INITIATING SLEEP");
      await util.sleep(1);
    }
  }
  var transactionSendingEndTime = new Date();
  util.printFormatedMessage("ALL TRANSACTIONS SENT IN " + (transactionSendingEndTime - transactionSendingStartTime) + " MILLISECONDS");

  //log the benchmark if all transactions returned
  Promise.all(promises.map(p => p.catch(() => undefined))).
  then(function () {
    benchmarkLib.logBenchmarkResult(scenario, approach, benchmarkID, startTime, maxRuntime, false, maxTransactions, true, successfulTransactions, transactionsTimestampMapStart, transactionsTimestampMapEnd);
  }, function (err) {
    console.log(err);
  });
}

function handleTransaction(transactionNumber) {
  return new Promise(function (resolve, reject) {
    sentTransaction++;
    console.log(httpProviderString + ": sending " + transactionNumber + " at " + timestamp('HH:mm:ss:ms'));

    if (miningOnFullWorkload != "True") {
      transactionsTimestampMapStart.set(transactionNumber, new Date());
    }

    contract1.methods.transferEther(contract2.options.address, amountTobeSent).send({
        from: accountAddress
      })
      .once('transactionHash', function (hash) {
        transactionHashesCount++;
        console.log(httpProviderString + ": received transaction hash " + transactionNumber + " at " + timestamp('HH:mm:ss:ms'));

        if (miningOnFullWorkload == "True") {
          //set starting time if all transactions received a transactionHash
          if (transactionHashesCount == maxTransactions) {
            util.printFormatedMessage("RECEIVED TRANSACTIONHASHES FOR ALL TRANSACTIONS");
            util.printFormatedMessage("STARTING BENCHMARK");
            startTime = new Date();
            for (var i = 1; i <= maxTransactions; i++) {
              transactionsTimestampMapStart.set(i, startTime);
            }
          }
        }
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