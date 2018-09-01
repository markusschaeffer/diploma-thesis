#!/bin/bash
# Install project dependencies/libraries

. env.sh
set -x #echo on

#Network Time Protocol for time sync
sudo apt-get update
sudo apt-get install ntp
sudo service ntp start

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

#web3
sudo npm install web3

#time-stamp for node scripts
sudo npm install --save time-stamp

#request and request-promise for RESTful client
npm install --save request
npm install --save request-promise

#read-last-N-lines of files
#https://www.npmjs.com/package/public-ip
npm install read-last-lines --save