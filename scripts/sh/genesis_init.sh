#!/bin/bash
# Initialize Geth node with genesis block
# $1: index of the node
# $2: path to genesis file

. env.sh
set -x #echo on

node_index=$1
path_to_genesis_file=$2

geth --datadir $ETH_DIR/node-$node_index/ init $path_to_genesis_file
