/**
 * REST server (bootnode-netstats)
 */

const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const routes = require("./routes_bootnode-netstats");
const util = require('./../../../util/util.js');

const pathToRootFolder = __dirname + "/../../../../../";
const serverPort = Number(util.readFileSync_lines(pathToRootFolder + "storage/ports/bootnode_port.txt")[0]);

// handle incoming requests
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

routes(app); // register routes

//start the server
var server = app.listen(serverPort, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Bootnode-Netstats REST server listening at http://%s:%s", host, port)
})