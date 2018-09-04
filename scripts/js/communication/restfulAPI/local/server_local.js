/**
 * REST server (local)
 */

const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const mongoose = require('mongoose');

const routes = require("./routes_local");
const BenchmarkLog = require("./model_local");

const serverPort = 8998;

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
    console.log("Benchmark recording app listening at http://%s:%s", host, port)
})