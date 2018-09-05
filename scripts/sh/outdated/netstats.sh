#!/bin/bash
# Setup and rund eth-netstats frontend and backend

#https://github.com/ethereum/wiki/wiki/Network-Status
#https://github.com/ethereum/go-ethereum/wiki/Setting-up-private-network-or-local-cluster

#The monitoring system consists of two components:
#1  eth-netstats - the monitoring service which lists the nodes.
#2  eth-net-intelligence-api OR netstats directly from the geth client

#WARNING: USE EITHER eth-net-intelligence-api or netstats directly from geth

. env.sh
set -x #echo on

cd $ETH_DIR

#TOTO change this for live version
#1	FRONTEND (eth-netstats)
#git clone https://github.com/cubedro/eth-netstats $ETH_DIR/eth-netstats	
#cd eth-netstats;
#npm install;
#sudo npm install -g grunt-cli
#grunt
#echo "##########ETH-NETSTATS FRONTEND INSTALLED##########"
sudo cp -a $ETH_DIR/../storage/eth-netstats $ETH_DIR # TODO REMOVE FOR LIVE VERSION
cd $ETH_DIR/eth-netstats
WS_SECRET=$WSSECRET npm start &
echo "##########ETH-NETSTATS FRONTEND STARTED##########"

#2	BACKEND ( eth-net-intelligence-api) or --netstats option of geth client
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
