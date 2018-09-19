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

#FIX FOR NPM EACCESS Error (required for global npm installations)
#https://docs.npmjs.com/getting-started/fixing-npm-permissions
mkdir ~/.npm-global # Make a directory for global installations:
npm config set prefix '~/.npm-global' # Configure npm to use the new directory path:
export PATH=~/.npm-global/:$PATH Open or create a ~/.profile file and add this line:

###NPM INSTALLATIONS###

#Express Framework and body-parser
npm install -g express
npm install -g body-parser

#Mongoose for MongoDB interaction
npm install -g mongoose

#web3
npm install -g web3

#time-stamp for node scripts
npm install -g time-stamp

#request and request-promise for RESTful client
npm install -g request
npm install -g request-promise

#read-last-N-lines of files
npm install -g read-last-lines

#public ip
#https://www.npmjs.com/package/public-ip
npm install -g public-ip

#make npm links to global packages in the project directory
cd scripts/sh
bash install_master_npm_links.sh