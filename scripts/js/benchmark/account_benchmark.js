/*
* Deployment of the Account Contract 
* https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#
*/

//require util functions
var util = require('./../util/util.js');

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
  gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
});
contract2.options.address = contract2Address;

var amountTobeSent = web3.utils.toWei('1', "ether");

contract1.methods.transferEther(contract2.options.address, amountTobeSent).send({from: accountAddress})
.then(function(receipt){
  console.log("Successfully sent");
  console.log(receipt);

  //check again the balance of the Smart Contract
  contract1.methods.getBalance().call(function(error, result){
    console.log("Contract 1 Balance is: " + web3.utils.fromWei(result, 'ether') + " ether");
  })

  //check again the balance of the Smart Contract
  contract2.methods.getBalance().call(function(error, result){
    console.log("Contract 2 Balance is: " + web3.utils.fromWei(result, 'ether') + " ether");
  })

})
.catch((error) => {
  console.error(error);
});;
