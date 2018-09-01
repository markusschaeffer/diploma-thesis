#!/bin/bash
# Delete local contract adddresses storage

. env.sh
set -x #echo on

cd $ROOT_DIR
sudo rm -rf storage/contract_addresses_server
cd storage 
mkdir contract_addresses_server
chmod -R 777 contract_addresses_server