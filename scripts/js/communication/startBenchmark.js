var client = require('./restfulClient/client');

client.startBenchmark('127.0.0.1', 8999, "account", 1000, 10);