/*
 * Benchmark of sending Ether between Contracts (see deployment folder)
 */

//require util functions
var util = require('./../util/util.js');
var timestamp = require('time-stamp');

//instantiate web3
var Web3 = require('web3');
var web3 = new Web3();

//set providers from Web3.providers
var httpPort = process.argv[2]; //get port as cli parameter
var httpProviderString = "http://localhost:" + httpPort;
//http provider (node-0 PORT 8100, node-1 PORT 8101)
web3 = new Web3(new Web3.providers.HttpProvider(httpProviderString));

const amountTransactions = 10000;

var timestampMapStart = new Map();
var timestampMapEnd = new Map();
var successfullTransactionCounter = 0;

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

var promises = [];
var sentTransactions = 0;
var benchmarkStartTime;

runBenchmark(amountTransactions);

function runBenchmark(amountTransactions) {
  util.printStartingBenchmarkMessage();
  benchmarkStartTime = new Date();
  for (var i = 1; i <= amountTransactions; i++) {
    promises.push(handleTransaction(i));
  }
  printResult();
}

function handleTransaction(transactionNumber) {
  return new Promise(function (resolve, reject) {
    sentTransactions++;
    console.log(httpProviderString + ": started " + transactionNumber + " at " + timestamp('HH:mm:ss:ms'));
    contract1.methods.transferEther(contract2.options.address, amountTobeSent).send({
        from: accountAddress
      })
      .once('transactionHash', function (hash) {
        timestampMapStart.set(transactionNumber, new Date());
        console.log(httpProviderString + ": received transaction hash " + transactionNumber + " at " + timestamp('HH:mm:ss:ms'));
      })
      .on('receipt', function (receipt) {
        successfullTransactionCounter++;
        timestampMapEnd.set(transactionNumber, new Date());
        console.log(httpProviderString + ": finished " + transactionNumber + " at " + timestamp('HH:mm:ss:ms'));
        return resolve(receipt);
      })
      .on('error', function (error) {
        return reject(error);
      })
  });
}

/**
 * wait for all promises to be resolved, then print statistic
 */
function printResult() {
  Promise.all(promises).then(function () {
    var timeDifference = Math.abs((new Date() - benchmarkStartTime) / 1000);
    util.printStatistics(timeDifference, successfullTransactionCounter, successfullTransactionCounter / timeDifference);

    contract2.methods.getBalance().call()
      .then(function (result) {
        console.log("Receiver contract balance is: " + web3.utils.fromWei(result, 'ether') + " ether");
      });

  }, function (err) {
    console.log(err);
  });
}