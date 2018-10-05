#!/bin/bash
# Delete contract adddresses storage on node

. env.sh
set -x #echo on

cd $ROOT_DIR
sudo rm -rf storage/contract_addresses_node
cd storage
mkdir contract_addresses_node
chmod -R 777 contract_addresses_node