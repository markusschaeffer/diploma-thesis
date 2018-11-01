#!/bin/bash

set -e -x

sudo apt-get install -y make
sudo apt-get install -y git
cd ~ 
git clone https://github.com/markusschaeffer/diploma-thesis.git
cd diploma-thesis
make install_node
make node_start