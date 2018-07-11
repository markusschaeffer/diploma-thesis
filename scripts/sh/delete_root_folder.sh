#!/bin/bash
#delete root folder of blockchain if existing

. env.sh
set -x #echo on

cd $ROOT_DIR;
sudo rm -rf $FOLDERNAME;