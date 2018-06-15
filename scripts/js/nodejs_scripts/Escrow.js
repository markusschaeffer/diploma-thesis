/*
* Deployment of the Escrow Contract 
* https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#
*/

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
var abiArray = [{"constant":true,"inputs":[],"name":"getBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"withdrawEther","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"}];
// contract Bytecode
var contractBytecode = "0x" + "608060405234801561001057600080fd5b50610151806100206000396000f30060806040526004361061004c576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806312065fe01461004e5780633bed33ce14610079575b005b34801561005a57600080fd5b506100636100a6565b6040518082815260200191505060405180910390f35b34801561008557600080fd5b506100a4600480360381019080803590602001909291905050506100c5565b005b60003073ffffffffffffffffffffffffffffffffffffffff1631905090565b6100cd6100a6565b81111515156100db57600080fd5b3373ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f19350505050158015610121573d6000803e3d6000fd5b50505600a165627a7a7230582054ebb374f44429c317d9ae41941975684ddc34ea1b5ab42f2f34d33a47f2f6940029";

// contract
var myContract = new web3.eth.Contract(abiArray);

//deploy the contract to the blockchain
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
  
  //check the balance of the Escrow Smart Contract
  myContract.methods.getBalance().call(function(error, result){
    console.log("Balance is: " + result);
  })
  .then(function(){
    //send some Ether to the Escrow Smart Contract
    var receiver = myContract.options.address;
    var amount = web3.utils.toWei('1', "ether");
  
    web3.eth.sendTransaction({
      from: accountAddress,
      to: receiver,
      value: amount
    })
    .then(function(receipt){
      console.log(receipt)
    })
    .then(function(){
      console.log("3");
      //check again the balance of the Escrow Smart Contract
      myContract.methods.getBalance().call(function(error, result){
        console.log("Balance is: " + result);
      })
    })
  })
});

