/*
* Deployment of the Ballot Contract 
* https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#
* .on(), .once(): https://nodejs.org/docs/latest/api/events.html#events_emitter_on_eventname_listener
* .then(): https://stackoverflow.com/questions/3884281/what-does-the-function-then-mean-in-javascript
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
var abiArray = [{"constant":true,"inputs":[],"name":"winningProposal","outputs":[{"name":"_winningProposal","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"toVoter","type":"address"}],"name":"giveRightToVote","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"toProposal","type":"uint8"}],"name":"vote","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_numProposals","type":"uint8"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];

// contract Bytecode
var contractBytecode = "0x" + "608060405234801561001057600080fd5b506040516020806104dc83398101806040528101908080519060200190929190505050336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060018060008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600001819055508060ff166002816100ec91906100f3565b5050610146565b81548183558181111561011a57818360005260206000209182019101610119919061011f565b5b505050565b61014391905b8082111561013f5760008082016000905550600101610125565b5090565b90565b610387806101556000396000f300608060405260043610610057576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063609ff1bd1461005c5780639e7b8d611461008d578063b3f98adc146100d0575b600080fd5b34801561006857600080fd5b50610071610100565b604051808260ff1660ff16815260200191505060405180910390f35b34801561009957600080fd5b506100ce600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061017c565b005b3480156100dc57600080fd5b506100fe600480360381019080803560ff169060200190929190505050610279565b005b6000806000809150600090505b6002805490508160ff161015610177578160028260ff1681548110151561013057fe5b9060005260206000200160000154111561016a5760028160ff1681548110151561015657fe5b906000526020600020016000015491508092505b808060010191505061010d565b505090565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415806102245750600160008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160009054906101000a900460ff165b1561022e57610276565b60018060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600001819055505b50565b6000600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002090508060010160009054906101000a900460ff16806102e157506002805490508260ff1610155b156102eb57610357565b60018160010160006101000a81548160ff021916908315150217905550818160010160016101000a81548160ff021916908360ff160217905550806000015460028360ff1681548110151561033c57fe5b90600052602060002001600001600082825401925050819055505b50505600a165627a7a723058209bdfaaa35853d6b90a2b3ac427f1c48d4cc95c7f622ab8aa26320d2f6029c5f60029";

// contract
var myContract = new web3.eth.Contract(abiArray);

//number of different proposals to vote for
var _numProposals = 5;

//deploy the contract to the blockchain
myContract.deploy({
  data: contractBytecode,
  arguments: [_numProposals]
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
  var filePath = "./../../../storage/contract_addresses/ballot.txt";
  //store deployed contract address to file
  util.saveContractAddress(filePath, myContract.options.address);
});
