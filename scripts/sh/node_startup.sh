#!/bin/bash

# Geth node startup
# $1:node index
# $2:netstats_ip
# $3:bootnode ip
# $4:path to genesis file
# $5:genesis name
# $6:target_gas_limit
# $7:mining

#HTTP ports 8100-81** (--rpc)
#WS ports 8500-85** (--ws)

. env.sh
set -x #echo on

nodeIndex=$1
netstats_ip=$2
bootnode_ip=$3
path_to_genesis_file=$4
genesis_name=$5
target_gas_limit=$6
mining=$7

#if target_gas_limit or mining_enable not set assing default values
target_gas_limit="${target_gas_limit:-4712388}"
mining="${mining:-true}"

##########1) create account for node##########
cd $SHFOLDER
bash ./create_account.sh $nodeIndex

###########2) init node with genesis.json##########
cd $SHFOLDER
bash ./genesis_init.sh $nodeIndex $path_to_genesis_file

##########3) write current genesis filename to genesis storage of node##########
cd $STORAGEFOLDER/current_genesis_node
echo "$genesis_name" > current_genesis.txt

##########4) GETH startup incl. mine##########
cd $ETH_DIR

#NETSTATS
netstats_address='node-'$nodeIndex:$WSSECRET@$netstats_ip:$NETSTATS_PORT

#BOOTNODE
bootnode_address=`cat $BOOTNODE_ENODE_ADDRESS`@$bootnode_ip:$BOOTNODE_PORT

#IPC-Path
node_ipcpath=$ETH_DIR/node-$nodeIndex/geth.ipc

#Network listening port (--port)
#node 0-9 at port 30310-30319
#start 10th node at 30320
if (($nodeIndex<10))
then
    portValue=3031$nodeIndex
else
    portIndex=$(expr $nodeIndex + 10)
    portValue=303$portIndex
fi

#HTTP and WebSockets variables
rpcaddrValue='localhost'
wsaddrValue='localhost'

#HTTP ports 8100-81** (--rpc)
#WS ports 8500-85** (--ws)
if (($nodeIndex<10))
then
    rpcportValue=810$nodeIndex
    wsportValue=850$nodeIndex
else
    rpcportValue=81$nodeIndex
    wsportValue=85$nodeIndex
fi

#Logfile TODO FIX
log_addr=$ETH_DIR/node-$nodeIndex
logfile=$log_addr/log_node$nodeIndex.txt
if [ ! -e "$logfile" ] ; then
    touch "$logfile"
fi
sudo chmod 777 $logfile

#https://github.com/ethereum/go-ethereum/wiki/Command-Line-Options

#--datadir 		        Data directory for the databases and keystore
#--identity 		    Custom node name
#-networkid 		    Network identifier (integer, 1=Frontier, 2=Morden (disused), 3=Ropsten, 4=Rinkeby) (default: 1)
#--ipcpath 		        Filename for IPC socket/pipe within the datadir (explicit paths escape it)
#--port 		        Network listening port (default: 30303)

#--rpc                  Enable the HTTP-RPC server
#--rpcaddr value        HTTP-RPC server listening interface (default: "localhost")
#--rpcport value        HTTP-RPC server listening port (default: 8545)
#--rpcapi value         API's offered over the HTTP-RPC interface
#--rpccorsdomain value	Comma separated list of domains from which to accept cross origin requests (browser enforced)

#--ws                   Enable the WS-RPC server
#--wsaddr value         WS-RPC server listening interface (default: "localhost")
#--wsport value         WS-RPC server listening port (default: 8546)
#--wsapi value          API's offered over the WS-RPC interface
#--wsorigins value      Origins from which to accept websockets requests

#--bootnodes value     	Comma separated enode URLs for P2P discovery bootstrap (set v4+v5 instead for light servers)
#--ethstats value      	Reporting URL of a ethstats service (nodename:secret@host:port)
#--gasprice 		    Minimal gas price to accept for mining a transactions
#targetgaslimit  	    Target gas limit sets the artificial target gas floor for the blocks to mine (default: 4712388)
#--unlock value    	    Comma separated list of accounts to unlock
#--password value  	    Password file to use for non-interactive password input
#--etherbase 		    Public address for block mining rewards (default = first account created) (default: "0")
#--mine 		        Enable mining
#--metrics              Enable metrics collection and reporting
#--minerthreads 	    Number of CPU threads to use for mining (default: 8)

sudo fuser -k $portValue/tcp #kill a possibly running process on the tcp geth port

#with inlcuded ethstats (without eth-net-intelligence-api)
if [ "$mining" = true ]; then
    geth \
        --datadir $ETH_DIR/node-$nodeIndex/ \
        --identity 'node-'$nodeIndex \
        --networkid "$NETWORK_ID" \
        --ipcpath $node_ipcpath \
        --port $portValue \
        --rpc \
        --rpcaddr $rpcaddrValue \
        --rpcport $rpcportValue \
        --rpcapi $RPCAPI \
        --rpccorsdomain "*" \
        --ws \
        --wsaddr $wsaddrValue \
        --wsport $wsportValue \
        --wsapi $WSAPI \
        --wsorigins "*" \
        --bootnodes $bootnode_address \
        --ethstats $netstats_address \
        --gasprice $GAS_PRICE \
        --targetgaslimit $target_gas_limit \
        --unlock 0 \
        --password $ETH_DIR/node-$nodeIndex/password.txt \
        --etherbase 0 \
        --mine \
        --metrics \
        --minerthreads 8 &
else
    geth \
        --datadir $ETH_DIR/node-$nodeIndex/ \
        --identity 'node-'$nodeIndex \
        --networkid "$NETWORK_ID" \
        --ipcpath $node_ipcpath \
        --port $portValue \
        --rpc \
        --rpcaddr $rpcaddrValue \
        --rpcport $rpcportValue \
        --rpcapi $RPCAPI \
        --rpccorsdomain "*" \
        --ws \
        --wsaddr $wsaddrValue \
        --wsport $wsportValue \
        --wsapi $WSAPI \
        --wsorigins "*" \
        --bootnodes $bootnode_address \
        --ethstats $netstats_address \
        --gasprice $GAS_PRICE \
        --targetgaslimit $target_gas_limit \
        --unlock 0 \
        --password $ETH_DIR/node-$nodeIndex/password.txt \
        --etherbase 0 &
fi
    