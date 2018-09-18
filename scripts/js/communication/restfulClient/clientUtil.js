/**
 * Util for clients
 */

const util = require('./../../util/util');
const rp = require('request-promise');

const pathToRootFolder = __dirname + "/../../../../";

module.exports = {

    //see https://github.com/request/request-promise
    sendRequest: function (options) {
        return new Promise(function (resolve, reject) {
            rp(options)
                .then(function (parsedBody) {
                    // request succeeded...
                    console.log("Response: " + JSON.stringify(parsedBody));
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