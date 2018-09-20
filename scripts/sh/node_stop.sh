#!/bin/bash
# Stop mining of Geth node
# $1: id of the node

. env.sh
set -x #echo on

id=$1

sudo geth attach $ETH_DIR/node-$WANIP-$id/geth.ipc --exec 'miner.stop()'