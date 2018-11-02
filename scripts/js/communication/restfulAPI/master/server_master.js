/**
 * REST server (master)
 */

const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const mongoose = require('mongoose');

const pathToRootFolder = __dirname + "/../../../../../";
const util = require('./../../../util/util.js');
const routes = require("./routes_master");
const BenchmarkLog = require("./model_master");

const restServerPort = Number(util.readFileSync_lines(pathToRootFolder + "config/ports/master_port.txt")[0]);
const dbIP = util.readFileSync_lines(pathToRootFolder + "config/db_settings/db_ip.txt")[0];
const dbPort = util.readFileSync_lines(pathToRootFolder + "config/db_settings/db_port.txt")[0];
const dbName = util.readFileSync_lines(pathToRootFolder + "config/db_settings/db_name.txt")[0];

mongoose.Promise = global.Promise;
// connect to local MongoDB
mongoose.connect("mongodb://" + dbIP + ":" + dbPort + "/" + dbName, {
        useNewUrlParser: true
    })
    .then(() => console.log("connected to mongoDB"))
    .catch(err => console.log(err));

// handle incoming requests
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

routes(app); // register routes

//start the server
var server = app.listen(restServerPort, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Master REST server listening at http://%s:%s", host, port)
})