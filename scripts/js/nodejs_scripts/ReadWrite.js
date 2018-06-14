/*
* Deployment ot the ReadWrite Contract 
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
var abiArray = [{"constant":false,"inputs":[],"name":"increaseVarCounter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getCounter","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_varString","type":"string"}],"name":"setVarString","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getVarString","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_varCounter","type":"uint256"}],"name":"setVarCounter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_varString","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];

// contract Bytecode
var contractBytecode = "0x" + "608060405234801561001057600080fd5b5060405161049b38038061049b833981018060405281019080805182019291905050508060009080519060200190610049929190610058565b506000600181905550506100fd565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061009957805160ff19168380011785556100c7565b828001600101855582156100c7579182015b828111156100c65782518255916020019190600101906100ab565b5b5090506100d491906100d8565b5090565b6100fa91905b808211156100f65760008160009055506001016100de565b5090565b90565b61038f8061010c6000396000f30060806040526004361061006d576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806360872d4f146100725780638ada066e1461008957806391aa423a146100b4578063a4ac27f31461011d578063bd337074146101ad575b600080fd5b34801561007e57600080fd5b506100876101da565b005b34801561009557600080fd5b5061009e6101ee565b6040518082815260200191505060405180910390f35b3480156100c057600080fd5b5061011b600480360381019080803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091929192905050506101f8565b005b34801561012957600080fd5b50610132610212565b6040518080602001828103825283818151815260200191508051906020019080838360005b83811015610172578082015181840152602081019050610157565b50505050905090810190601f16801561019f5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b3480156101b957600080fd5b506101d8600480360381019080803590602001909291905050506102b4565b005b600160008154809291906001019190505550565b6000600154905090565b806000908051906020019061020e9291906102be565b5050565b606060008054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156102aa5780601f1061027f576101008083540402835291602001916102aa565b820191906000526020600020905b81548152906001019060200180831161028d57829003601f168201915b5050505050905090565b8060018190555050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106102ff57805160ff191683800117855561032d565b8280016001018555821561032d579182015b8281111561032c578251825591602001919060010190610311565b5b50905061033a919061033e565b5090565b61036091905b8082111561035c576000816000905550600101610344565b5090565b905600a165627a7a7230582084d49ae61ed21ce2e3001f19a8993579b7215346bef13f40365133eee79abd7e0029";

// contract
var myContract = new web3.eth.Contract(abiArray);

// contract string
var _varString = "initial value";

//deploy the contract to the blockchain
myContract.deploy({
  data: contractBytecode,
  arguments: [_varString]
})
.send({
  from: accountAddress,
  gas: 1500000,
  gasPrice: '30000000000000'
}, function(error, transactionHash){ })
.on('error', function(error){console.error(error)})
.on('transactionHash', function(transactionHash){})
.once('receipt', function(receipt){console.log("contract address is " + receipt.contractAddress)})
.then(function(newContractInstance){
  //set the address of the mined contract
  myContract.options.address = newContractInstance.options.address;
  
  //invoke getVarString method of the ReadWrite contract via a call (for constant mehthods)
  myContract.methods.getVarString().call(function(error, result){
    console.log(result);
  })
})
.then(function(){
  //change varString
  _varString = "changed varString";
  myContract.methods.setVarString(_varString).send({from: accountAddress})
  .on('transactionHash', function(hash){})
  .on('error', console.error)// If there's an out of gas error the second parameter is the receipt.
  .once('receipt', function(receipt){    
    //verify varString has been changed
    //invoke getVarString method
    myContract.methods.getVarString().call(function(error, result){console.log(result);});
  })
});
