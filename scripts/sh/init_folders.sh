#!/bin/bash
# Creating folders for nodes
# $1: node index

. env.sh
set -x #echo on

node_index=$1

cd $ROOT_DIR
mkdir -p $FOLDERNAME
chmod 777 $FOLDERNAME

cd $FOLDERNAME
mkdir -p node-$WANIP-$node_index
chmod 777 node-$WANIP-$node$node_index