/*
* Helper functions
*/

module.exports = {
    
    //save a smart contract's address to a file
    saveContractAddress: function (filePath, address) {
        var fs = require('fs');
        var appendString = address + "\n";
        fs.appendFile(filePath, appendString, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("Contract address was saved to file");
        }); 
    }
};