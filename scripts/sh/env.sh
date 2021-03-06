#!/bin/bash
# Sets environment variables

#FOLDER STRUCTURE
ROOT_DIR=~/diploma-thesis
SHFOLDER=$ROOT_DIR/scripts/sh
JSFOLDER=$ROOT_DIR/scripts/js
FOLDERNAME=testnet
ETH_DIR=$ROOT_DIR/$FOLDERNAME
DATA_DIR=$ETH_DIR/datadir
STORAGEFOLDER=$ROOT_DIR/storage
WANIP=`dig +short myip.opendns.com @resolver1.opendns.com`

#GETH
NETWORK_ID=1515 # custom network id to distinguish between several networks
GAS_PRICE=1 #minimum gas price to accept for mining a transaction
RPCAPI='personal,db,eth,net,web3,txpool,miner'
WSAPI='personal,db,eth,net,web3,txpool,miner'

#ETH-NETSTATS
AMOUNT_NODES=20 #amount of nodes needed for eth-netstats backend (netstatconf.sh)
PREFIX=node #prefix needed for netstatconf.sh
NETSTATS_PORT=3000
WSSECRET=secret

#BOOTNODE
BOOTNODE_PORT=30309
BOOTNODE_VERBOSITY=9
BOOTNODE_ENODE_ADDRESS=$ROOT_DIR/storage/bootnode/bootnode_enode_address.txt
BOOTKEY=$ROOT_DIR/storage/bootnode/boot.key