web3.eth.accounts.forEach(function(account) {
	var balance = web3.eth.getBalance(account);
	var ether = web3.fromWei(balance, 'ether');
	console.log("Account: " + account + " Balance: " + balance);
});
