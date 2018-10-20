/**
 * REST server (master)
 */

const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const publicIp = require('public-ip');
const util = require('./../../../util/util.js');
const routes = require("./routes_master");
const BenchmarkLog = require("./model_master");
const mode = process.argv[2];

const pathToRootFolder = __dirname + "/../../../../../";
const serverPort = Number(util.readFileSync_lines(pathToRootFolder + "storage/ports/master_port.txt")[0]);

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

//write ip to master_ip in storage depending on the mode
if (mode != "local") {
    //non-local mode; get public IP and write it to master_ip.txt
    publicIp.v4().then(function (_ip) {
        util.writeToFile(pathToRootFolder + "storage/ips/master_ip.txt", _ip);
    });
} else {
    //local mode; write ip of local_ip.txt to master_ip.txt
    const localIP = util.readFileSync_lines(pathToRootFolder + "storage/ips/local_ip.txt")[0];
    util.writeToFile(pathToRootFolder + "storage/ips/master_ip.txt", localIP);
}