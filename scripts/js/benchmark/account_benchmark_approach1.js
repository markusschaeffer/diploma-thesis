/*
 * Benchmark of sending Ether between Contracts (see deployment folder)
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

const maxAmountTransactions = process.argv[3];
const maxMinutes = process.argv[4] * 1000 * 60;
var transactionsTimestampMapStart = new Map();
var transactionsTimestampMapEnd = new Map();
var successfullTransactionCounter = 0;
var promises = [];
var sentTransactionsCounter = 0;
var benchmarkStartTime;

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
  gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
});
contract1.options.address = contract1Address;

var contract2 = new web3.eth.Contract(abiArray, contract2Address, {
  //contract options
  gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
});
contract2.options.address = contract2Address;

var amountTobeSent = web3.utils.toWei('1', "ether"); //amount to be send for each transaction

runBenchmark(maxAmountTransactions, maxMinutes);

async function runBenchmark(maxAmountTransactions, maxMinutes) {
  util.printFormatedMessage("BENCHMARK STARTED");
  benchmarkStartTime = new Date();

  setTimeout(function () {
    benchmarkLib.printResultMaxTime(benchmarkStartTime, successfullTransactionCounter, transactionsTimestampMapStart, transactionsTimestampMapEnd);
  }, maxMinutes);

  for (var i = 1; i <= maxAmountTransactions; i++) {
    promises.push(handleTransaction(i));
  }

  Promise.all(promises.map(p => p.catch(() => undefined))).
  then(function () {
    benchmarkLib.printResultMaxTransactions(benchmarkStartTime, successfullTransactionCounter, transactionsTimestampMapStart, transactionsTimestampMapEnd);
  }, function (err) {
    console.log(err);
  });
}

function handleTransaction(transactionNumber) {
  return new Promise(function (resolve, reject) {
    sentTransactionsCounter++;
    console.log(httpProviderString + ": sending " + transactionNumber + " at " + timestamp('HH:mm:ss:ms'));

    contract1.methods.transferEther(contract2.options.address, amountTobeSent).send({
        from: accountAddress
      })
      .once('transactionHash', function (hash) {
        transactionsTimestampMapStart.set(transactionNumber, new Date());
        console.log(httpProviderString + ": received transaction hash " + transactionNumber + " at " + timestamp('HH:mm:ss:ms'));
      })
      .on('receipt', function (receipt) {
        successfullTransactionCounter++;
        transactionsTimestampMapEnd.set(transactionNumber, new Date());
        console.log(httpProviderString + ": finished " + transactionNumber + " at " + timestamp('HH:mm:ss:ms'));
        return resolve(receipt);
      })
      .on('error', function (error) {
        return reject(error);
      });
  });
}