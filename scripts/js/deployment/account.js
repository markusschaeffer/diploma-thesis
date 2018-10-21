/*
 * Deployment of the Account Contract 
 * https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#
 */

//require util functions
const util = require('./../util/util.js');
const pathToRootFolder = __dirname + "/../../../";

//specify which account to use for contract deployment (pays the gas cost)
const accountAddress = util.readFileSync_full(pathToRootFolder + "storage/staticAccount_address/address.txt");
const accountPassword = util.readFileSync_full(pathToRootFolder + "storage/staticAccount_password/password.txt");
const gethHttpPort = util.readFileSync_full(pathToRootFolder + "storage/ports/geth_http_port_node0.txt");

// instantiate web3
const Web3 = require('web3');
var web3 = new Web3();

// set the provider you want from Web3.providers
// provider = node-0 RPC PORT 8100
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:" + gethHttpPort));

// unlock account
web3.eth.personal.unlockAccount(accountAddress, accountPassword).
then(() => {
  console.log('Account unlocked.');
}).
catch(console.error);

// contract ABI
const filePath_abi = pathToRootFolder + "smart_contracts/account/target/Account.abi";
const abiArrayString = util.readFileSync_full(filePath_abi);
const abiArray = JSON.parse(abiArrayString);

// contract Bytecode
const filePath_bin = pathToRootFolder + "smart_contracts/account/target/Account.bin";
const bytecode = util.readFileSync_full(filePath_bin);
const contractBytecode = "0x" + bytecode;

// contract
const myContract = new web3.eth.Contract(abiArray);

//deploy the contract to the blockchain and send some ether from account[0] to the smart contract
const amount = web3.utils.toWei('1000000', "ether");

util.printFormatedMessage("INITIALISING BENCHMARK QUEUE");
//initialize benchmark queue in temp folder with benchmark_settings/benchmark_size.txt
const benchmark_size = util.readFileSync_lines(pathToRootFolder + "storage/benchmark_settings/benchmark_size.txt")[0];
util.writeToFile(pathToRootFolder + "storage/temp/benchmark_queue.txt", benchmark_size);

//deploy the contract to the blockchain
util.printFormatedMessage("DEPLOYING CONTRACT");
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
    var filePath = pathToRootFolder + "storage/contract_addresses_node/account.txt";
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