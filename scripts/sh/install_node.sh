#!/bin/bash
# Install project dependencies/libraries

. env.sh
set -x #echo on

#Network Time Protocol for time sync
sudo apt-get update
sudo apt-get install ntp
sudo service ntp start

#Make
sudo apt-get install make

#GNU C COmpiler
sudo apt-get install gcc

#G++
sudo apt-get install g++

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

#NPM EACCESS Error 
#https://docs.npmjs.com/getting-started/fixing-npm-permissions

#web3 (needs make, g++ and gcc)
npm install -g web3

#time-stamp for node scripts
npm install -g --save time-stamp

#request and request-promise for RESTful client
npm install -g --save request
npm install -g --save request-promise

#read-last-N-lines of files
npm install -g read-last-lines --save

#public ip
#https://www.npmjs.com/package/public-ip
npm install -g --save public-ip