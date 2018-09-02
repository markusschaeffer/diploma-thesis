var client = require('./restfulClient/client_local');

//TODO get node IPS from storage and loop over them -----------------------------------------------
//switch for smartContractType
client.deployContract('127.0.0.1', 8999, "account");
