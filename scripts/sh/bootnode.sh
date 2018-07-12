#!/bin/bash
#setup a bootnode for node discovery

. env.sh
set -x #echo on

cd $ETH_DIR
sudo bootnode -genkey boot.key #generate key (enode) for bootnode
sudo chmod 777 boot.key
touch bootnode.txt
sudo chmod 777 bootnode.txt
sudo fuser -k $BOOTNODE_PORT/udp #kill a running process on the bootnode port

#startup a bootnode using the generated key
#redirect stderr to bootnode.txt (which will later be used to catch the bootnode address)
bootnode \
    -nodekey boot.key \
    -verbosity $BOOTNODE_VERBOSITY \
    -addr :$BOOTNODE_PORT 2> bootnode.txt &
echo "##########BOOTNODE STARTED##########"

#get bootnode address to bootnode_enode_address.txt
cd $SHFOLDER
bash bootnode_getaddress.sh
