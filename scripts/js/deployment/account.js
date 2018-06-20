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

//specify which account to use for contract deployment (pays the gas cost)
var accountAddress = "0x5dfe021f45f00ae83b0aa963be44a1310a782fcc";

// unlock account
web3.eth.personal.unlockAccount(accountAddress, "iloveethereum").
    then(() => { console.log('Account unlocked.'); }).
    catch(console.error);

// contract ABI
var abiArray = [{"constant":true,"inputs":[],"name":"getBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"withdrawEther","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"}];

// contract Bytecode
var contractBytecode = "0x" + "608060405234801561001057600080fd5b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506102ca806100606000396000f300608060405260043610610062576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806312065fe0146100645780633bed33ce1461008f5780638da5cb5b146100bc578063b6b55f2514610113575b005b34801561007057600080fd5b50610079610133565b6040518082815260200191505060405180910390f35b34801561009b57600080fd5b506100ba600480360381019080803590602001909291905050506101ad565b005b3480156100c857600080fd5b506100d1610268565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6101316004803603810190808035906020019092919050505061028d565b005b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561019057600080fd5b3073ffffffffffffffffffffffffffffffffffffffff1631905090565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561020857600080fd5b610210610133565b811115151561021e57600080fd5b3373ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f19350505050158015610264573d6000803e3d6000fd5b5050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b803414151561029b57600080fd5b505600a165627a7a72305820a666b450c29c602ecaa79d5263c6d167c34ad4ad49d054752540b11b0543ff590029";

// contract
var myContract = new web3.eth.Contract(abiArray);

//deploy the contract to the blockchain and send some ether from account[0] to the smart contract
var amount = web3.utils.toWei('100', "ether");
myContract.deploy({
  data: contractBytecode,
  arguments: []
})
.send({
  from: accountAddress,
  gas: 1500000,
  gasPrice: '30000000000000'
}, function(error, transactionHash){ })
.on('error', function(error){console.error(error)})
.on('transactionHash', function(transactionHash){})
.on('receipt', function(receipt){console.log("contract address is " + receipt.contractAddress)})
.then(function(newContractInstance){
  //set the address of the mined contract
  myContract.options.address = newContractInstance.options.address;

  //store deployed contract address to file
  var filePath = "./../../../storage/contract_addresses/account.txt";
  util.saveContractAddress(filePath, myContract.options.address);
  
  //check the balance of the Smart Contract
  myContract.methods.getBalance().call(function(error, result){
    console.log("Balance is: " + web3.utils.fromWei(result, 'ether') + " ether");
  })
  .then(function(){
    //send some Ether to the Smart Contract
    var receiver = myContract.options.address;
    web3.eth.sendTransaction({
      from: accountAddress,
      to: receiver,
      value: amount
    })
    .then(function(receipt){
      console.log(receipt)
    })
    .then(function(){
      //check again the balance of the Smart Contract
      myContract.methods.getBalance().call(function(error, result){
        console.log("Balance is: " + web3.utils.fromWei(result, 'ether') + " ether");
      })
    })
  })
});

