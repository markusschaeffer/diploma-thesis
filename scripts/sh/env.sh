#!/bin/bash
#sets environment variables

#FOLDER STRUCTURE
ROOT_DIR=~/Dropbox/UbuntuVM/DropboxShared/diploma-thesis #change
SHFOLDER=$ROOT_DIR/scripts/sh
JSFOLDER=$ROOT_DIR/scripts/js
FOLDERNAME=testnet
ETH_DIR=$ROOT_DIR/$FOLDERNAME
DATA_DIR=$ETH_DIR/datadir

#GETH
NETWORK_ID=1515
GAS_PRICE=0
RPCAPI='personal,db,eth,net,web3,txpool,miner'

#ETH-NETSTATS
AMOUNT_NODES=20 #amount of nodes needed for eth-netstats backend (netstatconf.sh)
PREFIX=node #prefix needed for netstatconf.sh
NETSTATS_PORT=3000
WSSECRET=secret

#BOOTNODE
BOOTNODE_PORT=30309
BOOTNODE_VERBOSITY=9
BOOTNODE_ENODE_ADDRESS_FILE=$ETH_DIR/bootnode_enode_address.txt



