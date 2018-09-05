#!/bin/bash
# Setup a bootnode for Geth node discovery

. env.sh
set -x #echo on

sudo fuser -k $BOOTNODE_PORT/udp #kill a running process on the bootnode port

#startup a bootnode using the key located in /storage/bootnode
bootnode \
    -nodekey $BOOTKEY \
    -verbosity $BOOTNODE_VERBOSITY \
    -addr :$BOOTNODE_PORT
echo "##########BOOTNODE STARTED##########"