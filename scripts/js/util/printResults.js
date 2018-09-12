/**
 * Prints results of different scenarios
 * 
 * Note: can only e used at a eth node (NO REST COMMUNICATION)
 * 
 * argv[2] : scenario (account, ballot or readWrite)
 */

const util = require('./util.js');
const pathToRootFolder = __dirname + "/../../../";

const scenario = process.argv[2];

//instantiate web3
const Web3 = require('web3');
var web3 = new Web3();

const ip = "localhost";
//get CLI parameters
const gethHttpPort = util.readFileSync_full(pathToRootFolder + "storage/ports/geth_http_port_node0.txt");
const gasPrice = '20000000000';

//set providers from Web3.providers
const httpProviderString = "http://" + ip + ":" + gethHttpPort;
//http provider (node-0 PORT 8100, node-1 PORT 8101)
web3 = new Web3(new Web3.providers.HttpProvider(httpProviderString));

var filePath_abi;
switch (scenario) {
    case 'account':
        filePath_abi = pathToRootFolder + "smart_contracts/account/target/Account.abi";
        break;
    case 'ballot':
        filePath_abi = pathToRootFolder + "smart_contracts/ballot/target/Ballot.abi";
        break;
    case 'readWrite':
        //TODO----------------------------------------
        break;
    default:
        throw new Error("Unknown Scenario - use account, ballot or readWrite");

}
//get contract ABI from local .abi file
var abiArrayString = util.readFileSync_full(filePath_abi);
var abiArray = JSON.parse(abiArrayString);

switch (scenario) {
    case 'account':

        var filePath = pathToRootFolder + "storage/contract_addresses_node/account.txt";
        var addresses = util.readFileSync_lines(filePath);
        var contract1Address = addresses[0];
        var contract2Address = addresses[1];

        //get contracts
        var contract1 = new web3.eth.Contract(abiArray, contract1Address, {
            gasPrice: gasPrice
        });
        contract1.options.address = contract1Address;
        var contract2 = new web3.eth.Contract(abiArray, contract2Address, {
            gasPrice: gasPrice
        });
        contract2.options.address = contract2Address;

        contract1.methods.getBalance().call(function (error, result) {
            console.log("Contract1 " + "(" + contract1Address + ")" + " balance is: " + web3.utils.fromWei(result, 'ether') + " ether");
        })

        contract2.methods.getBalance().call(function (error, result) {
            console.log("Contract2 " + "(" + contract2Address + ")" + " balance is: " + web3.utils.fromWei(result, 'ether') + " ether");
        })

        break;
    case 'ballot':
        //get deployed smart contract address

        var filePath = pathToRootFolder + "storage/contract_addresses_node/ballot.txt";
        var contractAddress = util.readFileSync_lines(filePath)[0];

        //get contract
        var contract = new web3.eth.Contract(abiArray, contractAddress, {
            gasPrice: gasPrice
        });
        contract.options.address = contractAddress;

        const _numProposals = util.readFileSync_lines(pathToRootFolder + "storage/ips/nodes_ip.txt").length;
        console.log("number of proposals: " + _numProposals);

        for (var i = 0; i <= _numProposals - 1; i++) {
            printResults(i);
        }

        contract.methods.winningProposal.call(function (error, result) {
            console.log("Id of winnngProposal is: " + result);
        });

        function printResults(i) {
            contract.methods.getVoteCountForProposal(i).call(function (error, result) {
                console.log("VoteCount for proposal " + i + ": " + result);
            });
        }
        break;
    case 'readWrite':
        //TODO----------------------------------------
        break;
    default:
        throw new Error("Unknown scenario - use account, ballot or readWrite");
}