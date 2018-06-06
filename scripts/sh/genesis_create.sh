#!/bin/bash
#create a genesis.json via puppeth

. env.sh
set -x #echo on

cd $ETH_DIR 
puppeth
