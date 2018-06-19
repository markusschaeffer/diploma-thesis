pragma solidity ^0.4.0;

contract greeter{
    /* define variable greeting of the type string */
    string greeting;
    
    /* this runs when the contract is executed */
    function greeter(string _greeting) public {
        greeting = _greeting;
    }

    /* main function */
    function greet() view returns (string) {
        return greeting;
    }
}
