#!/bin/bash
# Resume mining at Geth node
# $1: id of the node

. env.sh
set -x #echo on

id=$1

sudo geth attach $ETH_DIR/node-$id/geth.ipc --exec 'miner.start()'