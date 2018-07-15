var express = require('express');
var app = express();
var bodyParser = require('body-parser')

var server = app.listen(8999, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})

app.use(bodyParser.json());

app.post('/', function (req, res) {
    
    var jsonRequest = req.body;
    console.log(jsonRequest);
    res.end(JSON.stringify("OK"));
})