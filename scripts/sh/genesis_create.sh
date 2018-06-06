#!/bin/bash
#create a genesis.json via puppeth

set -x #echo on
. env.sh

cd $ETH_DIR 
puppeth
