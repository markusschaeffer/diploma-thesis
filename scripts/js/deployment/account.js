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
then(() => {
  console.log('Account unlocked.');
}).
catch(console.error);

// contract ABI
var filePath_abi = "./../../../smart_contracts/account/target/Account.abi";
var abiArrayString = util.readFileSync_full(filePath_abi);
var abiArray = JSON.parse(abiArrayString);

// contract Bytecode
var filePath_bin = "./../../../smart_contracts/account/target/Account.bin";
var bytecode = util.readFileSync_full(filePath_bin);
var contractBytecode = "0x" + bytecode;

// contract
var myContract = new web3.eth.Contract(abiArray);

util.printFormatedMessage("DEPLOYING CONTRACT");
//deploy the contract to the blockchain and send some ether from account[0] to the smart contract
var amount = web3.utils.toWei('1000000', "ether");
myContract.deploy({
    data: contractBytecode,
    arguments: []
  })
  .send({
    from: accountAddress,
    gas: 1500000,
    gasPrice: '30000000000000'
  }, function (error, transactionHash) {})
  .on('error', function (error) {
    console.error(error)
  })
  .on('transactionHash', function (transactionHash) {})
  .on('receipt', function (receipt) {
    console.log("contract address is " + receipt.contractAddress)
  })
  .then(function (newContractInstance) {
    util.printFormatedMessage("CONTRACT DEPLOYED");
    //set the address of the mined contract
    myContract.options.address = newContractInstance.options.address;

    //store deployed contract address to contract address storage folder
    var filePath = "./../../../storage/contract_addresses_server/account.txt";
    util.saveContractAddress(filePath, myContract.options.address);
    
    //check the balance of the Smart Contract
    myContract.methods.getBalance().call(function (error, result) {
        console.log("Balance is: " + web3.utils.fromWei(result, 'ether') + " ether");
      })
      .then(function () {
        util.printFormatedMessage("FUNDING CONTRACT");
        //send some Ether to the Smart Contract
        var receiver = myContract.options.address;
        web3.eth.sendTransaction({
            from: accountAddress,
            to: receiver,
            value: amount
          })
          .then(function (receipt) {
            //console.log(receipt)
          })
          .then(function () {
            //check again the balance of the Smart Contract
            myContract.methods.getBalance().call(function (error, result) {
              console.log("New balance is: " + web3.utils.fromWei(result, 'ether') + " ether");
            })
          })
      })
  });