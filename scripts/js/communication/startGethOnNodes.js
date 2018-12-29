/**
 * Script for starting geth client on nodes via REST API
 * 
 * process.argv[2]=mode (i.e. local or not)
 */

const util = require('./../util/util');
const client = require('./restfulClient/client_master');
const publicIp = require('public-ip');

const pathToRootFolder = __dirname + "/../../../";
const mode = process.argv[2];
const ips = util.readFileSync_lines(pathToRootFolder + "storage/ips/nodes_ip.txt");
const port = util.readFileSync_lines(pathToRootFolder + "config/ports/node_port.txt")[0];
const genesis = util.readFileSync_lines(pathToRootFolder + "config/current_genesis/current_genesis.txt")[0];
const instanceType = util.readFileSync_lines(pathToRootFolder + "config/instance_settings/instance_type.txt")[0];
const bootnodeIP = util.readFileSync_lines(pathToRootFolder + "storage/ips/bootnode_ip.txt")[0];
const netstatsIP = util.readFileSync_lines(pathToRootFolder + "storage/ips/netstats_ip.txt")[0];
const miningSettings = util.readFileSync_lines(pathToRootFolder + "storage/mining_settings/mining.txt");
const miningOnFullWorkload = util.readFileSync_lines(pathToRootFolder + "config/mining_settings/mining_on_full_workload.txt")[0];

/*
 * If targetGasLimit was not manually set in target_gas_limit.txt use the gasLimit set in the genesis.json
 */
const manualtargetGasLimit = util.readFileSync_lines(pathToRootFolder + "config/mining_settings/target_gas_limit.txt")[0];
var targetGasLimit = manualtargetGasLimit;
var genesisJson = require(pathToRootFolder + "genesis_json_files/" + genesis);
var genesisGasLimit;

for (var key in genesisJson) {
    if (key == "gasLimit") {
        genesisGasLimit = parseInt(genesisJson[key], 16); //convert hex to int
    }
}
if (manualtargetGasLimit == null) {
    console.log("Geth targeGasLimit set to genesisGasLimit");
    targetGasLimit = genesisGasLimit;
} else {
    console.log("Geth targeGasLimit manually set to value in target_gas_limit.txt");
}

var masterIP;
if (mode != "local") {
    console.log("mode!=local")
    publicIp.v4().then(function (masterIP) {
        for (var i = 0; i <= ips.length - 1; i++) {
            try {
                //get mining setting for the particular node
                var mining = miningSettings[i];
                //start Geth on node
                client.startGeth(ips[i], port, genesis, targetGasLimit, mining, miningOnFullWorkload, instanceType, masterIP, bootnodeIP, netstatsIP);
            } catch (e) {
                console.error("Error at starting Geth on node");
                console.error(e);
            }
        }
    })
} else {
    console.log("mode = local")
    masterIP = util.readFileSync_lines(pathToRootFolder + "config/ips/local_ip.txt")[0];
    for (var i = 0; i <= ips.length - 1; i++) {
        var mining = true;
        client.startGeth(ips[i], port, genesis, targetGasLimit, mining, miningOnFullWorkload, instanceType, masterIP, bootnodeIP, netstatsIP);
    }
}