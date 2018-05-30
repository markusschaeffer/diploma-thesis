#!/bin/bash
#get the account address(inlcuding other data) from node_account_address_temp.txt and extract it to node_account_address.txt for later use
# $1: node index

set -x #echo on
. env.sh

node_number=$1

cd $ETH_DIR/node$node_number/
chmod 777 keystore
(cut -d '{' -f2 node_account_address_temp.txt) > node_account_address_temp2.txt
sleep 1
(cut -d '}' -f1 node_account_address_temp2.txt) > node_account_address.txt
sleep 1

sed -i '1s/^/0x/' node_account_address.txt #add 0x as a preamble

rm node_account_address_temp.txt
rm node_account_address_temp2.txt

echo "##########ACCOUNT ADDRESS STORED##########"
