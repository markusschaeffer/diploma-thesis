/*
 * Benchmark for a simple voting (ballot) (see deployment folder)
 * 
 * argv[2] : httpPort
 * argv[3] : maxTransactions
 * argv[4] : maxRuntime
 * argv[5] : smartContract address
 * argv[6] : benchmarkID
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
var benchmarkID = process.argv[6];

//default values
if (httpPort == undefined) httpPort = util.readFileSync_full(pathToRootFolder + "storage/ports/geth_http_port_node0.txt");
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
//specify which account to use for gas costs for each transaction
const accountAddress = util.readFileSync_full(pathToRootFolder + "storage/staticAccount_address/address.txt");
const scenario = "ballot";
const approach = 3;

var transactionsTimestampMapStart = new Map();
var transactionsTimestampMapEnd = new Map();
var successfulTransactions = 0;
var promises = [];
var sentTransaction = 0;
var startTime;
var proposalId;

//get contract ABI from local .abi file
var filePath_abi = pathToRootFolder + "smart_contracts/ballot/target/Ballot.abi";
var abiArrayString = util.readFileSync_full(filePath_abi);
var abiArray = JSON.parse(abiArrayString);

//get deployed smart contract address (via argv or from a local file in folder storage)
if (process.argv[5] != null) {
  var contractAddress = process.argv[5];
} else {
  var filePath = pathToRootFolder + "storage/contract_addresses_node/ballot.txt";
  var contractAddress = util.readFileSync_lines(filePath)[0];
}

//get contract
var contract = new web3.eth.Contract(abiArray, contractAddress, {
  gasPrice: gasPrice
});
contract.options.address = contractAddress;

//run benchmark
runBenchmark(maxTransactions, maxRuntimeInSeconds);

async function runBenchmark(maxTransactions, maxRuntime) {

  //vote for a random proposal
  const numProposals = util.readFileSync_lines(pathToRootFolder + "storage/ips/nodes_ip.txt").length;
  proposalId = Math.floor(Math.random() * numProposals);

  startTime = new Date();
  util.printFormatedMessage("BENCHMARK STARTED");

  setTimeout(function () {
    benchmarkLib.logBenchmarkResult(scenario, approach, benchmarkID, startTime, maxRuntime, true, maxTransactions, false, successfulTransactions, transactionsTimestampMapStart, transactionsTimestampMapEnd);
  }, maxRuntimeInMilliseconds);

  for (var i = 1; i <= maxTransactions; i++) {
    promises.push(handleTransaction(i));
    if (sentTransaction % maxTransactionBatchSize == 0) {
      util.printFormatedMessage("INITIATING SLEEP");
      await util.sleep(1);
    }
  }

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
    transactionsTimestampMapStart.set(transactionNumber, new Date());

    contract.methods.vote(proposalId).send({
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