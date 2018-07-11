/*
* Benchmark of Two Account Contracts (see deployment folder)
* Approach: An account sends transactions to another account.
* The payload of each transaction is one Ether
*/

//require util functions
var util = require('./../util/util.js');
var benchmarkLib = require('./../benchmark-lib/benchmark-lib.js');
var timestamp = require('time-stamp');

//instantiate web3
var Web3 = require('web3');
var web3 = new Web3();

//set providers from Web3.providers
var httpPort = process.argv[2]; //get port as cli parameter
var httpProviderString = "http://localhost:" + httpPort;
//http provider (node-0 PORT 8100, node-1 PORT 8101)
web3 = new Web3(new Web3.providers.HttpProvider(httpProviderString));

var wsPort = process.argv[3];
var wsProviderString = "ws://localhost:" + wsPort;
//websockets provider (node-0 PORT 8500, node-1 PORT 8501)
web3WS = new Web3(new Web3.providers.WebsocketProvider(wsProviderString));

const transactionBatches = 1;
const transactionsPerBatch = 500;

var timestampMapStart = new Map();
var timestampMapEnd = new Map();
var successfullTransactionCounter = 0;

//specify which account to use for gas costs for each transaction
var accountAddress = "0x5dfe021f45f00ae83b0aa963be44a1310a782fcc";

//Get Smart Contract addresses
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

var i = 1;
var promises = [];
var startDate = new Date();

/*
var subscription = web3WS.eth.subscribe('newBlockHeaders', function(error, result){
  if (!error)
      console.log(result);
})
.on("data", function(transaction){
  console.log(transaction);
});
*/

while(i <= transactionBatches)
{
  for (var j = 1; j <= transactionsPerBatch; j++){
    promises.push(handleTransaction(j)); //TODO clarif why benchmarkLib.handleTransaction(j) does not work!
  }
  i++;
}

//wait for all promises to be resolved, then print statistic
Promise.all(promises).then(function() {
    var timeDifference = Math.abs((new Date() - startDate) / 1000);
    util.printStatistics(timeDifference, successfullTransactionCounter, successfullTransactionCounter/timeDifference);

    contract2.methods.getBalance().call(function(error, result){
      console.log("Receiver contract balance is: " + web3.utils.fromWei(result, 'ether') + " ether");
    })
    
  }, function(err) {
    // error occurred
});


function handleTransaction (transactionNumber){
  return new Promise(function(resolve, reject) {
    //setTimestapMap.set(i,timestamp('HH:mm:ss:ms'));
    console.log(httpProviderString + ": started " + transactionNumber + " at " + timestamp('HH:mm:ss:ms'));
    timestampMapStart.set(transactionNumber, new Date());
    
    contract1.methods.transferEther(contract2.options.address, amountTobeSent).send({from: accountAddress})
    .on('transactionhash', function (hash){
      console.log(hash);
    })
    .on('receipt', function(receipt){
      //receipt = mined
      successfullTransactionCounter++;
      timestampMapStart.set(transactionNumber, new Date());
      console.log(httpProviderString + ": finished " + transactionNumber + " at " + timestamp('HH:mm:ss:ms'));
      resolve(receipt);
    })
    .on('error', function (error){
      console.error(error);
      return reject(error);
    })
  });
}