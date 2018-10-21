/**
 * Util functions
 */

const fs = require('fs');
const os = require("os");
const readline = require('readline');

module.exports = {

    /**
     * save a smart contract's address to a file
     */
    saveContractAddress: function (filePath, address) {

        try {
            var appendString = address + "\n";
            fs.appendFile(filePath, appendString, function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log(address + " was saved to file " + filePath);
            });
        } catch (error) {
            console.log(error);
        }
    },

    /**
     * appends a text to a file
     */
    appendToFile: function (filePath, text) {

        try {
            var appendString = text + "\n";
            fs.appendFile(filePath, appendString, function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log(text + " has been appended to file " + filePath);
            });
        } catch (error) {
            console.log(error);
        }
    },

    readLineFromFile: function (filePath) {

        const rl = readline.createInterface({
            input: fs.createReadStream(filePath),
            crlfDelay: Infinity
        });

        rl.on('line', (line) => {
            console.log(`Line from file: ${line}`);
        });
    },

    readFileSync_lines: function (filePath) {
        try {
            var text = fs.readFileSync(filePath, 'utf8');
            var text_splitted = text.split(os.EOL);

            //remove last line if blank
            if (text_splitted[text_splitted.length - 1] == "") {
                text_splitted = text_splitted.slice(0, -1);
            }

            return text_splitted;
        } catch (e) {
            throw new Error("Error at reading file " + filePath + "\n " + e);
        }
    },

    readFileSync_full: function (filePath) {
        try {
            var text = fs.readFileSync(filePath, 'utf8');
            return text;
        } catch (e) {
            throw new Error("Error at reading file " + filePath + "\n " + e);
        }
    },

    printFormatedMessage: function (text) {
        console.log("\n");
        console.log("----------" + text + "----------");
        console.log("\n");
    },

    sleep: function (ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    writeToFile: function (filePath, text) {
        try {
            fs.writeFileSync(filePath, text);
        } catch (e) {
            throw new Error("Error at writing to file " + filePath + "\n " + e);
        }
    }
};