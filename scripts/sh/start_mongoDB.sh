#!/bin/bash
# Start local mongoDB
# mongodb commands for BenchmarkLog Collection
# https://docs.mongodb.com/manual/mongo/

. env.sh
set -x #echo on

echo "##########STARTING MONGODB##########"
sudo systemctl start mongod #starting MongoDB 

#mongo #start mongodb shell
#db.getCollectionNames() # show all collections
#db.benchmarklogs.find().pretty() # show benchmarklogs