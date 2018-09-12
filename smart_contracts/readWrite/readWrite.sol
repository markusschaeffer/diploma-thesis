pragma solidity ^0.4.0;

/*
 * Simple bean contract
 */
contract ReadWrite{
    
    string varString;
    uint256 varCounter;
    
    /* constructor*/
    constructor (string _varString) public {
        varString = _varString;
        varCounter = 0;
    }

    /* getters */
    function getVarString() public view returns (string) {
        return varString;
    }
    
    function getCounter() public view returns (uint256) {
        return varCounter;
    }
    
    /* setters */
    function setVarString(string _varString) public{
        varString = _varString;
    }
    
    function setVarCounter(uint256 _varCounter) public{
        varCounter = _varCounter;
    }
    
    /* increment varCounter */
    function increaseVarCounter() public{
        varCounter++;
    }
    
}
