/*
* Deployment of the Greeter Contract 
* https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#
*/

/*
Note on web3
As this API is designed to work with a local RPC node, all its functions use synchronous HTTP requests by default.
If you want to make an asynchronous request, you can pass an optional callback as the last parameter to most functions. 
All callbacks are using an error first callback style
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
var abiArray = [{"constant":true,"inputs":[],"name":"greet","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_greeting","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];

// contract Bytecode
var contractBytecode = "0x" + "608060405234801561001057600080fd5b506040516102a83803806102a8833981018060405281019080805182019291905050508060009080519060200190610049929190610050565b50506100f5565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061009157805160ff19168380011785556100bf565b828001600101855582156100bf579182015b828111156100be5782518255916020019190600101906100a3565b5b5090506100cc91906100d0565b5090565b6100f291905b808211156100ee5760008160009055506001016100d6565b5090565b90565b6101a4806101046000396000f300608060405260043610610041576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063cfae321714610046575b600080fd5b34801561005257600080fd5b5061005b6100d6565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561009b578082015181840152602081019050610080565b50505050905090810190601f1680156100c85780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b606060008054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561016e5780601f106101435761010080835404028352916020019161016e565b820191906000526020600020905b81548152906001019060200180831161015157829003601f168201915b50505050509050905600a165627a7a72305820545d91bb01beb6ed7c5e3052c475c6aae615070b506aad78278ceb2793f22dba0029";

// contract
var myContract = new web3.eth.Contract(abiArray);

// greeting string (defined in the greeter contract)
var _greeting = "Hello World!";

//deploy the contract to the blockchain
myContract.deploy({
  data: contractBytecode,
  arguments: [_greeting]
})
.send({
  from: accountAddress,
  gas: 1500000,
  gasPrice: '30000000000000'
}, function(error, transactionHash){})
.on('error', function(error){console.error(error)})
.on('transactionHash', function(transactionHash){})
.on('receipt', function(receipt){
console.log("receipt - contract address is " + receipt.contractAddress) // contains the new contract address})
//.on('confirmation', function(confirmationNumber, receipt){})
.then(function(newContractInstance){
  console.log("confirmation - contract address is: " + newContractInstance.options.address) // instance with the new contract address

  //set the address of the mined contract
  myContract.options.address = newContractInstance.options.address;
  
  //invoke greet method of the Greeter contract via a call (for constant mehthods such as greet())
  myContract.methods.greet().call(function(error, result){
    console.log(result);
  });
  
});
