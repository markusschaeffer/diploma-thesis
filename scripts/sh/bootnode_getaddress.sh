#!/bin/bash
#get the enode address (inlcuding other data) from bootnode.txt and extract it to bootnode_enode_address.txt for later use

. env.sh
set -x #echo on

cd $ETH_DIR
touch bootnode_enode_address_temp.txt
sudo chmod 777 bootnode_enode_address_temp.txt
touch bootnode_enode_address.txt
sudo chmod 777 bootnode_enode_address.txt
sleep 1
(cut -d '=' -f2 bootnode.txt) > bootnode_enode_address_temp.txt
sleep 1
(cut -d '@' -f1 bootnode_enode_address_temp.txt) > bootnode_enode_address.txt
sleep 1
rm bootnode_enode_address_temp.txt
echo "##########BOOTNODE ADDRESS STORED##########"
