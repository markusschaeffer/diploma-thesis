/**
 * REST server (local)
 */

const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const util = require('./../../../util/util.js');
const routes = require("./routes_master");
const BenchmarkLog = require("./model_master");

const pathToRootFolder = __dirname + "/../../../../../";
const serverPort = Number(util.readFileSync_lines(pathToRootFolder + "storage/ports/master_port"));

mongoose.Promise = global.Promise;
// connect to local MongoDB
mongoose.connect("mongodb://localhost:27017/test")
    .then(() => console.log("connected to mongoDB"))
    .catch(err => console.log(err));

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
    console.log("Master REST server listening at http://%s:%s", host, port)
})