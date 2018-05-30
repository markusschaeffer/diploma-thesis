#!/bin/bash
#setup and rund eth-netstats frontend and backend

#https://github.com/ethereum/wiki/wiki/Network-Status
#https://github.com/ethereum/go-ethereum/wiki/Setting-up-private-network-or-local-cluster

set -x #echo on
. env.sh

cd $ETH_DIR

#FRONTEND
git clone https://github.com/cubedro/eth-netstats $ETH_DIR/eth-netstats	
cd eth-netstats;
npm install;
sudo npm install -g grunt-cli
echo "##########ETH-NETSTATS FRONTEND INSTALLED##########"
grunt
WS_SECRET=$WSSECRET npm start &
echo "##########ETH-NETSTATS FRONTEND STARTED##########"

#BACKEND
git clone https://github.com/cubedro/eth-net-intelligence-api $ETH_DIR/eth-net-intelligence-api
cd $ETH_DIR/eth-net-intelligence-api;
npm install;
sudo npm install -g pm2
echo "##########ETH-NETSTATS BACKEND INSTALLED##########"

#use modified netstatconf.sh to create an app.json suitable for pm2
#git clone https://github.com/ethersphere/eth-utils.git $ETH_DIR/eth-net-intelligence-api/eth-utils
#cd $ETH_DIR/eth-net-intelligence-api/eth-utils;
cd $ETH_DIR; cd ../scripts
cp netstatconf.sh $ETH_DIR/eth-net-intelligence-api
cd $ETH_DIR; cd $ETH_DIR/eth-net-intelligence-api
##########TODO CHANGE PARAMETERS##########
bash netstatconf.sh $AMOUNT_NODES $PREFIX http://localhost:3000 $WSSECRET > app.json;

#start backend
cd $ETH_DIR/eth-net-intelligence-api
pm2 start app.json
echo "##########ETH-NETSTATS BACKEND STARTED##########"
