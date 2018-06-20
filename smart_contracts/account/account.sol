pragma solidity ^0.4.0;

/*
* see https://programtheblockchain.com/posts/2017/12/15/writing-a-contract-that-handles-ether/
*/
contract Account  {
    
    address public owner;
    
    constructor() public {
        owner = msg.sender;
    }

    function deposit(uint256 amount) payable public {
        require(msg.value == amount);
    }

    function withdrawEther(uint256 amount) public onlyOwner {
        require(amount<=getBalance());
        //transfer ether from this address
        msg.sender.transfer(amount);
    }
    
    function getBalance() view public onlyOwner returns (uint256) {
        return address(this).balance;
    }

    function() public payable{}
    
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

}
