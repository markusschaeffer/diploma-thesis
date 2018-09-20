#!/bin/bash
# Install project dependencies/libraries

. env.sh
set -x #echo on

#Network Time Protocol for time sync
sudo apt-get update -y
sudo apt-get install ntp -y
sudo service ntp start

#Ethereum(Geth-Client)
sudo apt-get install software-properties-common -y
sudo add-apt-repository -y ppa:ethereum/ethereum -y
sudo apt-get update -y
sudo apt-get install ethereum -y

#NodeJS and NPM (do not use apt-get install npm)
sudo apt-get install curl
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs # npm is installed with nodejs

#Docker and Docker-Compose
sudo apt-get install docker -y
sudo apt-get install docker-compose -y

#Solidity Compiler (only used locally)
#which solc #/usr/bin/solc
sudo add-apt-repository ppa:ethereum/ethereum
sudo apt-get update -y
sudo apt-get install solc -y

#MongoDB
#(sudo systemctl start mongodb) for starting MongoDB 
#https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-16-04
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
echo "deb http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list
sudo apt-get update -y
sudo apt-get install -y mongodb-org

###NPM INSTALLATIONS###

cd $(ROOT_DIR)

#Express Framework and body-parser
npm install express
npm install body-parser

#Mongoose for MongoDB interaction
npm install mongoose

#web3
npm install web3

#time-stamp for node scripts
npm install time-stamp

#request and request-promise for RESTful client
npm install request
npm install request-promise

#read-last-N-lines of files
npm install read-last-lines

#public ip
npm install public-ip