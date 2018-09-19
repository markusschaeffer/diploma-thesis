#!/bin/bash
# Install project dependencies/libraries

. env.sh
set -x #echo on

#Network Time Protocol for time sync
sudo apt-get update
sudo apt-get install ntp -y
sudo service ntp start

#GNU C COmpiler
sudo apt-get install gcc -y

#G++
sudo apt-get install g++ -y

#Ethereum(Geth-Client)
sudo apt-get install software-properties-common -y
sudo add-apt-repository -y ppa:ethereum/ethereum -y
sudo apt-get update -y
sudo apt-get install ethereum -y

#NodeJS and NPM (do not use apt-get install npm)
sudo apt-get install curl -y
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs # npm is installed with nodejs

#Docker and Docker-Compose
sudo apt-get install docker -y
sudo apt-get install docker-compose -y

#FIX FOR NPM EACCESS Error (required for global npm installations)
#https://docs.npmjs.com/getting-started/fixing-npm-permissions
mkdir ~/.npm-global # Make a directory for global installations:
npm config set prefix '~/.npm-global' # Configure npm to use the new directory path:
export PATH=~/.npm-global/:$PATH # Open or create a ~/.profile file and add this line:

###NPM INSTALLATIONS###

#Express Framework and body-parser
npm install -g express
npm install -g body-parser

#web3 (needs make, g++ and gcc)
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
bash install_node_npm_links.sh