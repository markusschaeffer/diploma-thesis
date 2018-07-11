#!/bin/bash
#make all ports free for geth, bootnode and eth-netstats startup

echo "##########KILLING RUNNING GETH, BOOTNODE, NODE##########"

sudo pkill geth
sudo pkill bootnode
sudo pkill node

echo "##########PORTS FREE##########"