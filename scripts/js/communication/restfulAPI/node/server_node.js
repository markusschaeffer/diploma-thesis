/**
 * REST server (node)
 * 
 * process.argv[2] = masterIP
 * process.argv[3] = mode (use "local" for local ip)
 */

const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const publicIp = require('public-ip');

const pathToRootFolder = __dirname + "/../../../../../";
const routes = require("./routes_node");
const util = require('./../../../util/util.js');
const client = require("./../../restfulClient/client_node")

const restServerPort = Number(util.readFileSync_lines(pathToRootFolder + "config/ports/node_port.txt")[0]);
const localIP = util.readFileSync_lines(pathToRootFolder + "config/ips/local_ip.txt")[0];

const masterIP = process.argv[2];
const mode = process.argv[3];

if (masterIP == null || masterIP == undefined) {
    throw new Error("No masterIP provided!");
}

// handle incoming requests
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

routes(app); // register routes

//start the server
var server = app.listen(restServerPort, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Benchmark recording app listening at http://%s:%s", host, port)

    //store masterIP to storage/master_ip.txt
    try {
        util.writeToFile(pathToRootFolder + "storage/ips/master_ip.txt", masterIP);
    } catch (e) {
        console.error("Error at writing masterIP to master_ip.txt");
    }

    if (mode != "local") {
        //register node at master
        publicIp.v4().then(function (ownIP) {
            client.sendNodeIP(masterIP, ownIP);
        });
    } else {
        client.sendNodeIP(masterIP, localIP);
    }
})