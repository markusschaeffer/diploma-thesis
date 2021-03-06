pragma solidity ^0.4.0;

/*
 * Simple account contract 
 * see https://programtheblockchain.com/posts/2017/12/15/writing-a-contract-that-handles-ether/
 */
contract Account  {
    
    address public owner;
    
    constructor() public payable{
        owner = msg.sender; //define owner of account
    }
    
    //returns the contract's balance in wei
    function getBalance() view public returns (uint256) {
        return address(this).balance;
    }

    //returns the address of the owner
    function getOwner() view public returns (address) {
        return owner;
    }

    //transfer Ether from this contract to a specified address
    function transferEther(address _etherreceiver, uint256 _amount) public onlyOwner{
	    require(_amount <= getBalance());
        _etherreceiver.transfer(_amount);
    }

    //fallback method to receive ether
    function() public payable{}
    
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

}
