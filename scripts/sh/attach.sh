#!/bin/bash
#attach to a node's javaScript console

. env.sh
set -x #echo on

nodeIndex=$1

sudo geth attach $ETH_DIR/node-$nodeIndex/geth.ipc console