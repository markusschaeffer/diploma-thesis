#!/bin/bash
# Delete root folder if existing

. env.sh
set -x #echo on

cd $ROOT_DIR
sudo rm -rf $FOLDERNAME