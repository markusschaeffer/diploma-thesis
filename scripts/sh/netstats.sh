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

cd $ROOT_DIR
sudo rm -rf eth-netstats #delete eth-netstats folder if existing

#1	FRONTEND (eth-netstats)
git clone https://github.com/cubedro/eth-netstats $ROOT_DIR/eth-netstats	
cd eth-netstats;
npm install;
sudo npm install -g grunt-cli
grunt
WS_SECRET=$WSSECRET npm start &
echo "##########ETH-NETSTATS FRONTEND STARTED##########"