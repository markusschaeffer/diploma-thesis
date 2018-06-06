#!/bin/bash
# installing ethereum, nodejs and docker(for puppeth)

. env.sh
set -x #echo on

#Ethereum(Geth-Client)
sudo apt-get install software-properties-common
sudo add-apt-repository -y ppa:ethereum/ethereum
sudo apt-get update
sudo apt-get install ethereum

#NodeJS and NPM
sudo apt-get install curl
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
#sudo apt-get install npm
#sudo ln -s /usr/bin/nodejs /usr/bin/node

#Docker and Docker-Compose
sudo apt-get install docker
sudo apt-get install docker-compose

