#!/bin/bash
# Delete local current genesis storage

. env.sh
set -x #echo on

cd $ROOT_DIR
rm -rf storage/current_genesis_server
cd storage
mkdir current_genesis_server
chmod -R 777 current_genesis_server