#!/bin/bash
# creating and account
# $1: node index

set -x #echo on
. env.sh

node_number=$1

cd $ETH_DIR/node$node_number/
touch node_account_address.txt
chmod 777 node_account_address.txt

#generate new account
geth --datadir $ETH_DIR/node$node_number/ --password <(echo -n "") account new > $ETH_DIR/node$node_number/node_account_address_temp.txt

#store account address to 
bash account_getaddress.sh 


