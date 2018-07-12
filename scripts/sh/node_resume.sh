#!/bin/bash

. env.sh
set -x #echo on

id=$1

sudo geth attach $ETH_DIR/node-$id/geth.ipc --exec 'miner.start()'