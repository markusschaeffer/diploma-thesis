/**
 * Util for clients
 */

var util = require('./../../util/util');
var rp = require('request-promise');

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

                    if (parsedBody.contractDeployed != null) {
                        //contracts have been deployed
                        //--> store contract addresses in storage folder
                        var filePath = __dirname + "/../../../../storage/contract_addresses_local/account.txt";
                        util.saveContractAddress(filePath, parsedBody.address1);
                        util.saveContractAddress(filePath, parsedBody.address2);
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