/*
* Deployment of the Account Contract 
* https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#
*/

//require util functions
var util = require('./../util/util.js');
var benchmarkLib = require('./../benchmark-lib/benchmark-lib.js');
var timestamp = require('time-stamp');

// instantiate web3
var Web3 = require('web3');
var web3 = new Web3();

var wsPort = 8500;
var wsProviderString = "ws://localhost:" + wsPort;
web3WS = new Web3(new Web3.providers.WebsocketProvider(wsProviderString));

//possible subscriptions: pendingTransactions, newBlockHeaders, syncing, logs
var subscription = web3WS.eth.subscribe('newBlockHeaders',
/*{
  address: '0x5dfe021f45f00ae83b0aa963be44a1310a782fcc',
},*/
 function(error, result){
  if (!error)
      console.log(result);
})
.on("data", function(transaction){
  console.log(transaction);
});

// unsubscribes the subscription
subscription.unsubscribe(function(error, success){
  if(success)
      console.log('Successfully unsubscribed!');
});