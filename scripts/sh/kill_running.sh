#!/bin/bash
# Kill running geth, bootnode and nodejs processes
# => free ports for new processes

echo "##########KILLING RUNNING GETH, BOOTNODE, NODE##########"

sudo pkill geth
sudo pkill bootnode
sudo pkill node

echo "##########PORTS FREE##########"