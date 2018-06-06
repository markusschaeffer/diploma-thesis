#!/bin/bash
# create account for node 
# $1: node index

#https://github.com/ethereum/go-ethereum/wiki/Managing-your-accounts

set -x #echo on
. env.sh

node_number=$1

cd $ETH_DIR/node-$node_number/
touch node_account_address.txt
chmod 777 node_account_address.txt
touch password.txt
chmod 777 password.txt

#generate new account
geth --datadir $ETH_DIR/node-$node_number/ --password $ETH_DIR/node-$node_number/password.txt account new > $ETH_DIR/node-$node_number/node_account_address_temp.txt

#store account address to node_account_address.txt
cd $SHFOLDER
bash account_getaddress.sh 


