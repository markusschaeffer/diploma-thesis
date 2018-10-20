/**
 * REST server (node)
 */

const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const routes = require("./routes_node");
const util = require('./../../../util/util.js');
const client = require("./../../restfulClient/client_node")
const publicIp = require('public-ip');

const pathToRootFolder = __dirname + "/../../../../../";
const serverPort = Number(util.readFileSync_lines(pathToRootFolder + "storage/ports/node_port.txt")[0]);
const localIP = util.readFileSync_lines(pathToRootFolder + "storage/ips/local_ip.txt")[0];
const mode = process.argv[2];

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
    
    //send node ip to master
    if (mode != "local") {
        publicIp.v4().then(function (_ip) {
            client.sendNodeIP(_ip);
        });
    } else {
        client.sendNodeIP(localIP);
    }

})