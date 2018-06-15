pragma solidity ^0.4.0;

contract escrow {

/*	
    function depositEther() payable public {
        require(msg.value>0);
    }
*/  
    function withdrawEther(uint256 amount) public {
        require(amount<=getBalance());
        //transfer ether from this address
        msg.sender.transfer(amount);
    }
    
    function getBalance() constant public returns (uint256) {
        return address(this).balance;
    }

    /*
	what if funds are sent to your contract to a non payable function? 
	For this the fallback payable function was defined,
	which can receive funds in any case funds are sent to the contract. 
    */
    function() payable {}
}
