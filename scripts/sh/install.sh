#!/bin/bash
# installing all kind of software/dependencies needed for the project

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

#Solidity Compiler (only used locally)
#sudo add-apt-repository ppa:ethereum/ethereum
#sudo apt-get update
#sudo apt-get install solc
#which solc #/usr/bin/solc

#web3
sudo npm install web3

#time-stamp for node scripts
sudo npm install --save time-stamp

#request and request-promise for RESTful client
npm install --save request
npm install --save request-promise

#MongoDB (only used locally)
#https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-16-04
#sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
#echo "deb http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list
#sudo apt-get update
#sudo apt-get install -y mongodb-org
#sudo systemctl start mongod #starting MongoDB 

#Mongoose for MongoDB interaction
npm install --save mongoose