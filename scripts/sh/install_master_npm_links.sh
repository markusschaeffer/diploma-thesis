#!/bin/bash
# Install project dependencies/libraries

. env.sh
set -x #echo on

#change to root directory of project for npm link creation
cd $ROOT_DIR

#Express Framework and body-parser
npm link express
npm link body-parser

#Mongoose for MongoDB interaction
npm link mongoose

#web3
npm link web3

#time-stamp for node scripts
npm link time-stamp

#request and request-promise for RESTful client
npm link request
npm link request-promise

#read-last-N-lines of files
npm link read-last-lines

#public ip
npm link public-ip