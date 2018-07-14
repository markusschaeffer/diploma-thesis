/*
* Benchmark of Two Account Contracts (see deployment folder)
* Approach: An account sends transactions to another account.
* The payload of each transaction is one Ether
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

const amountTransactions = 1000; 

var timestampMapStart = new Map();
var timestampMapEnd = new Map();
var successfullTransactionCounter = 0;
var transactionHashesReceived = 0;

//specify which account to use for gas costs for each transaction
const accountAddress = "0x5dfe021f45f00ae83b0aa963be44a1310a782fcc";

//get deployed smart contract addresses from a local file in folder storage
var contract1Address = "";
var contract2Address = "";
var filePath = "./../../../storage/contract_addresses/account.txt";
var addresses = util.readFileSync_lines(filePath);
if((addresses.length-1)>=2){
  contract1Address=addresses[0];
  contract2Address=addresses[1];
}else
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
var benchmarkStartTime = new Date();

runBenchmark(amountTransactions);

async function runBenchmark(amountTransactions){
  console.log("\nStarting benchmark\n");
  for (var i = 1; i <= amountTransactions; i++){
    
    promises.push(handleTransaction(i)); //TODO clarif why benchmarkLib.handleTransaction(j) does not work!
    
    //TODO new approach?:
    //query number of open file descriptors of the system? if over X wait
    //$processId = pgrep geth
    //sudo ls /proc/$processId/fd | wc -l
    if(sentTransactions % 100 == 0){
      console.log("initiateing sleep");
      await util.sleep(1);
    }  
  }
  printResult();
}

function handleTransaction (transactionNumber){
  return new Promise(function(resolve, reject) {
    sentTransactions++;
    console.log(httpProviderString + ": started " + transactionNumber + " at " + timestamp('HH:mm:ss:ms'));
    contract1.methods.transferEther(contract2.options.address, amountTobeSent).send({from: accountAddress})
    .once('transactionHash', function (hash){
      transactionHashesReceived++;
      timestampMapStart.set(transactionNumber, new Date());
      console.log(httpProviderString + ":received transaction hash " + transactionNumber + " at " + timestamp('HH:mm:ss:ms'));
      //console.log(hash);
    })
    .on('receipt', function(receipt){
      //receipt = mined
      successfullTransactionCounter++;
      timestampMapEnd.set(transactionNumber, new Date());
      console.log(httpProviderString + ": finished " + transactionNumber + " at " + timestamp('HH:mm:ss:ms'));
      return resolve(receipt);
    })
    .on('error', function (error){
      return reject(error);
    })
  });
}

function printResult(){

  //wait for all promises to be resolved, then print statistic
  //Promise.all takes an array of promises and creates a promise that fulfills when all of them successfully complete
  Promise.all(promises).then(function() {
    var timeDifference = Math.abs((new Date() - benchmarkStartTime) / 1000);
    util.printStatistics(timeDifference, successfullTransactionCounter, successfullTransactionCounter/timeDifference);

    contract2.methods.getBalance().call()
    .then(function(result){
      console.log("Receiver contract balance is: " + web3.utils.fromWei(result, 'ether') + " ether");
    });

  }, function(err) {
    console.log(err);
  });
    
}