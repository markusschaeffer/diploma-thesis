#!/bin/bash
#initialize node with genesis block

. env.sh
set -x #echo on

node_index=$1
path_to_genesis_file=$2

geth --datadir $ETH_DIR/node-$node_index/ init $path_to_genesis_file
