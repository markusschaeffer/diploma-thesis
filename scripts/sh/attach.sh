#!/bin/bash
# attach to a node's JavaScript console
# $1: index of the node

. env.sh
set -x #echo on

nodeIndex=$1

sudo geth attach $ETH_DIR/node-$nodeIndex/geth.ipc console