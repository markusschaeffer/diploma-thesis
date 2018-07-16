/**
 * REST server (running on a system without geth) for incoming benchmark results 
 */
var express = require('express');
var app = express();
var bodyParser = require('body-parser')

var routes = require("./routes");

// handle incoming requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

routes(app); // register routes

//start the server
var server = app.listen(8999, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Benchmark recording app listening at http://%s:%s", host, port)
})