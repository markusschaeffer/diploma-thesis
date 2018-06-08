#bin/!bash

#invokes the javascript file for deployment of the Greeter contract
#mining of the contract into the blockchain takes place on node-0

. env.sh
set -x #echo on

echo $ETH_DIR

cd $ETH_DIR/../smart_contracts/Greeter/deployment
sudo geth attach $ETH_DIR/node-0/geth.ipc --exec 'loadScript("Greeter.js")'
