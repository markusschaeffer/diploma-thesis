#!/bin/bash
# Attach to a node's javaScript console

. env.sh
#set -x #echo on

geth attach $ETH_DIR/node-0/geth.ipc --exec 'eth.pendingTransactions.length'