#!/bin/bash
# copy existing keystore files in each node for prefunded accounts with always the same address
# $1: node index

#https://github.com/ethereum/go-ethereum/wiki/Managing-your-accounts

. env.sh
set -x #echo on

node_number=$1

cd $ETH_DIR/node-$node_number/

touch node_account_address.txt
chmod 777 node_account_address.txt
#write account address to file
echo "0x5dfe021f45f00ae83b0aa963be44a1310a782fcc" > node_account_address.txt

touch password.txt
chmod 777 password.txt
#write password to file
echo "iloveethereum" > password.txt

#copy already existing private keys (keystore folder)
cd $ETH_DIR/../storage/staticAccount_keystore
cp -r keystore $ETH_DIR/node-$node_number/
cd $ETH_DIR/node-$node_number/
chmod 777 keystore
