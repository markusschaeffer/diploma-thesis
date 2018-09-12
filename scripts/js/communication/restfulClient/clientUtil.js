/**
 * Util for clients
 */

const util = require('./../../util/util');
const rp = require('request-promise');

const pathToRootFolder = __dirname + "/../../../../";

module.exports = {

    /**
     * see https://github.com/request/request-promise
     */
    sendRequest: function (options) {
        return new Promise(function (resolve, reject) {
            rp(options)
                .then(function (parsedBody) {
                    // request succeeded...
                    console.log("Response: " + JSON.stringify(parsedBody));

                    if (parsedBody.accountDeployed != null) {
                        //account contracts have been deployed
                        //--> store contract addresses in storage folder
                        var filePath = pathToRootFolder + "storage/contract_addresses_local/account.txt";
                        util.saveContractAddress(filePath, parsedBody.address1);
                        util.saveContractAddress(filePath, parsedBody.address2);
                    }

                    if (parsedBody.ballotDeployed != null) {
                        //ballot contract hasbeen deployed
                        //--> store contract address in storage folder
                        var filePath = pathToRootFolder + "storage/contract_addresses_local/ballot.txt";
                        util.saveContractAddress(filePath, parsedBody.address);
                    }

                    if(parsedBody.readWriteDeployed != null){
                        var filePath = pathToRootFolder + "storage/contract_addresses_local/readWrite.txt";
                        util.saveContractAddress(filePath, parsedBody.address);
                    }

                    resolve(parsedBody);
                })
                .catch(function (err) {
                    // request failed...
                    console.log(err);
                    reject(err);
                });
        });
    }
}