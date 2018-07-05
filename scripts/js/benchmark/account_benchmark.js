/*
* Deployment of the Account Contract 
* https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#
*/

//require util functions
var util = require('./../util/util.js');
var timestamp = require('time-stamp');

// instantiate web3
var Web3 = require('web3');
var web3 = new Web3();

// set the provider you want from Web3.providers
// provider = node-0 RPC PORT 8100
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8100"));

//specify which account to use for gas costs
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

// contract ABI
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

var amountTobeSent = web3.utils.toWei('1', "ether");

var setTimestapMap = new Map();

for (var i = 1; i<=1000; i++){
    sendTransaction(i);
}

function sendTransaction(transactionNumber){
  //setTimestapMap.set(i,timestamp('HH:mm:ss:ms'));
  console.log("started " + transactionNumber + " at " + timestamp('HH:mm:ss:ms'));
  
  contract1.methods.transferEther(contract2.options.address, amountTobeSent).send({from: accountAddress})
  .on('transactionhash', function (hash){
    console.log(hash);
  })
  .on('receipt', function(receipt){
    //receipt = mined
    console.log("finished " + transactionNumber + " at " + timestamp('HH:mm:ss:ms'));
  })
  .on('error', function (error){
    console.error(error);
    // lookup "Error: Failed to check for transaction receipt:"
  })
  .catch((error) => {
    console.error(error);
  });
}