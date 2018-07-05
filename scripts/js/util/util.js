/*
* Util functions
*/

module.exports = {
    
    //save a smart contract's address to a file
    saveContractAddress: function (filePath, address) {
        const fs = require('fs');
        var appendString = address + "\n";
        fs.appendFile(filePath, appendString, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("Contract address was saved to file");
        }); 
    },

    readLineFromFile: function (filePath){
        const readline = require('readline');
        const fs = require('fs');
     
        const rl = readline.createInterface({
            input: fs.createReadStream(filePath),
            crlfDelay: Infinity
        });
        
        rl.on('line', (line) => {
        console.log(`Line from file: ${line}`);
        });
    },

    readFileSync_lines: function (filePath){
        try{
            const fs = require('fs');
            const os = require("os");
    
            var text =  fs.readFileSync(filePath,'utf8');
            return text.split(os.EOL); //Will return an array of lines on every OS node works on
        }catch(e){
            throw new Error("Error at reading file " + filePath + "\n " + e);
        }
    },

    readFileSync_full: function (filePath){
        try{
            const fs = require('fs');
            const os = require("os");
    
            var text =  fs.readFileSync(filePath,'utf8');
            return text;
        }catch(e){
            throw new Error("Error at reading file " + filePath + "\n " + e);
        }
    },

    sleep: function (milliSeconds) {
        var startTime = new Date().getTime();
        while (new Date().getTime() < startTime + milliSeconds);
    },

    printStatistics: function(timepassed, successfullTransactionCounter, txPerSecond){
        console.log("\n");
        console.log("----------STATISTICS----------");
        console.log("Time passed in seconds: " + timepassed);
        console.log("# successfull transactions: " + successfullTransactionCounter);
        console.log("Transactions per second: " + txPerSecond);
        console.log("-----------------------------");
        console.log("\n");
    }
};