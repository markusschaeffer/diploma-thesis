#!/bin/bash
# Install project dependencies/libraries

. env.sh
set -x #echo on

#Network Time Protocol for time sync
sudo apt-get update
sudo apt-get install ntp -y
sudo service ntp start

#DNSUTILS for dig
sudo apt-get install -y dnsutils 

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

###NPM INSTALLATIONS###

cd "$ROOT_DIR"

#Express Framework and body-parser
npm install express
npm install body-parser

#web3 (needs make, g++ and gcc)
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

#grunt for netstats
npm install grunt-cli