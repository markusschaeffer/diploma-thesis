#!/bin/bash
#attach to a node's javaScript console

. env.sh
set -x #echo on

sudo geth attach $ETH_DIR/node-0/geth.ipc console