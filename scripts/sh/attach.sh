#!/bin/bash

. env.sh
set -x #echo on

cd $ETH_DIR/../scripts/js/checkAccounts/
sudo geth attach $ETH_DIR/node-0/geth.ipc console
#sudo geth attach $ETH_DIR/node-0/geth.ipc --exec 'loadScript("listAccountBalances.js")'
#sudo geth attach $ETH_DIR/node-0/geth.ipc --exec 'eth.pendingTransactions'
#sudo geth attach $ETH_DIR/node-0/geth.ipc --exec 'eth.getTransaction("0x....")'