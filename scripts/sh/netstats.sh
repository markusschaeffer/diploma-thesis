#!/bin/bash
#setup and rund eth-netstats frontend and backend

#https://github.com/ethereum/wiki/wiki/Network-Status
#https://github.com/ethereum/go-ethereum/wiki/Setting-up-private-network-or-local-cluster


#The monitoring system consists of two components:
#1    eth-netstats - the monitoring site which lists the nodes.
#2    eth-net-intelligence-api - these are processes that communicate with the ethereum client using RPC and push the data to the monitoring site via websockets.
#2 OR --netstats at geth

#WARNING: USE EITHER eth-net-intelligence-api or --netstats of geth

set -x #echo on
. env.sh

cd $ETH_DIR

#1	FRONTEND (eth-netstats)
git clone https://github.com/cubedro/eth-netstats $ETH_DIR/eth-netstats	
cd eth-netstats;
npm install;
sudo npm install -g grunt-cli
echo "##########ETH-NETSTATS FRONTEND INSTALLED##########"
grunt
WS_SECRET=$WSSECRET npm start &
echo "##########ETH-NETSTATS FRONTEND STARTED##########"

#2	BACKEND ( eth-net-intelligence-api)
#git clone https://github.com/cubedro/eth-net-intelligence-api $ETH_DIR/eth-net-intelligence-api
#cd $ETH_DIR/eth-net-intelligence-api;
#npm install;
#sudo npm install -g pm2
#echo "##########ETH-NETSTATS BACKEND INSTALLED##########"
#use modified netstatconf.sh to create an app.json suitable for pm2
#git clone https://github.com/ethersphere/eth-utils.git $ETH_DIR/eth-net-intelligence-api/eth-utils
#cd $ETH_DIR/eth-net-intelligence-api/eth-utils;
#cd $SHFOLDER
#cp netstatconf.sh $ETH_DIR/eth-net-intelligence-api
#cd $ETH_DIR; cd $ETH_DIR/eth-net-intelligence-api
##########TODO CHANGE PARAMETERS##########
#bash netstatconf.sh $AMOUNT_NODES $PREFIX http://localhost:3000 $WSSECRET > app.json;
#cd $ETH_DIR/eth-net-intelligence-api
#pm2 start app.json
#echo "##########ETH-NETSTATS BACKEND STARTED##########"
