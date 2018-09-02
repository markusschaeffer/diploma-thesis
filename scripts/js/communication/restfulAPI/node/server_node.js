/**
 * REST server (node)
 */

const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const routes = require("./routes_node");

const serverPort = 8999;

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
    console.log("Benchmark recording app listening at http://%s:%s", host, port)
})