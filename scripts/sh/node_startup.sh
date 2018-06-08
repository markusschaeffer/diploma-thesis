#!/bin/bash
#node startup incl. mining

. env.sh
set -x #echo on

node_index=$1
netstats_ip=$2
bootnode_ip=$3
path_to_genesis_file=$4

##########1) create account for node##########
cd $SHFOLDER
bash ./create_account.sh $node_index

###########2) init node with genesis.json##########
cd $SHFOLDER
bash ./genesis_init.sh $node_index $path_to_genesis_file

##########3) GETH startup incl. mine##########
cd $ETH_DIR

#NETSTATS
netstats_address='node-'$node_index:$WSSECRET@$netstats_ip:$NETSTATS_PORT

#BOOTNODE
bootnode_address=`cat $BOOTNODE_ENODE_ADDRESS_FILE`@$bootnode_ip:$BOOTNODE_PORT

#IPC-Path
node_ipcpath=$ETH_DIR/node-$node_index/geth.ipc

#GETH PORT
#--port Network listening port (default: 30303)
#node 0-9 at port 30310-30319
#start 10th node at 30320
if (($node_index<10))
then
    node_port=3031$node_index
else
    port_index=$(expr $node_index + 10)
    node_port=303$port_index
fi

#RPC addr and port
#--rpcaddr HTTP-RPC server listening interface (default: "localhost")
#--rpcport HTTP-RPC server listening port (default: 8545)
node_rpcaddr='localhost'

#node 0-9 at RPC port 8100-8109
#start 10th node at RPC port 8110
if (($node_index<10))
then
    node_rpcport=810$node_index
else
    node_rpcport=81$node_index
fi

#Logfile
log_addr=$ETH_DIR/node-$node_index
logfile=$log_addr/log_node$node_index.txt
if [ ! -e "$logfile" ] ; then
    touch "$logfile"
fi
sudo chmod 777 $logfile

#https://github.com/ethereum/go-ethereum/wiki/Command-Line-Options

#--datadir 		Data directory for the databases and keystore
#--identity 		Custom node name
#-networkid 		Network identifier (integer, 1=Frontier, 2=Morden (disused), 3=Ropsten, 4=Rinkeby) (default: 1)
#--nodiscover 		Disables the peer discovery mechanism (manual peer addition)
#--ipcpath 		Filename for IPC socket/pipe within the datadir (explicit paths escape it)
#--syncmode 		Blockchain sync mode ("fast", "full", or "light")
#--port 		Network listening port (default: 30303)
#--rpc                  Enable the HTTP-RPC server
#--rpcaddr value        HTTP-RPC server listening interface (default: "localhost")
#--rpcport value        HTTP-RPC server listening port (default: 8545)
#--rpcapi value         API's offered over the HTTP-RPC interface
#--rpccorsdomain value	Comma separated list of domains from which to accept cross origin requests (browser enforced)
#--bootnodes value     	Comma separated enode URLs for P2P discovery bootstrap (set v4+v5 instead for light servers)
#--ethstats value      	Reporting URL of a ethstats service (nodename:secret@host:port)
#--gasprice 		Minimal gas price to accept for mining a transactions
#targetgaslimit  	Target gas limit sets the artificial target gas floor for the blocks to mine (default: 4712388)
#--unlock value    	Comma separated list of accounts to unlock
#--password value  	Password file to use for non-interactive password input
#--etherbase 		Public address for block mining rewards (default = first account created) (default: "0")
#--mine 		Enable mining
#--minerthreads 	Number of CPU threads to use for mining (default: 8)

#TODO decide if targetgaslimit should be used/increased (targetgaslimit is decreased over time until contracts can't be deployed any more)

sudo fuser -k $node_port/tcp #kill a possibly running process on the tcp geth port

#with inlcuded ethstats (without eth-net-intelligence-api)
geth --datadir $ETH_DIR/node-$node_index/ --identity 'node-'$node_index --networkid "$NETWORK_ID" --ipcpath $node_ipcpath --syncmode 'full' --port $node_port --rpc --rpcaddr $node_rpcaddr --rpcport $node_rpcport --rpcapi $RPCAPI --rpccorsdomain "*" --bootnodes $bootnode_address --ethstats $netstats_address --gasprice $GAS_PRICE --unlock 0 --password $ETH_DIR/node-$node_index/password.txt --etherbase 0 --mine --minerthreads 8 &
#todo: decide if > $logfile 2>&1 &


#without included ethstats (with eth-net-intelligence-api)
#geth --datadir $ETH_DIR/node-$node_index/ --identity 'node-'$node_index --networkid "$NETWORK_ID" --ipcpath $node_ipcpath --syncmode 'full' --port $node_port --rpc --rpcaddr $node_rpcaddr --rpcport $node_rpcport --rpcapi $RPCAPI --rpccorsdomain "*" --bootnodes $bootnode_address --gasprice $GAS_PRICE --unlock 0 --password $ETH_DIR/node-$node_index/password.txt --etherbase 0 --mine --minerthreads 1 &
#todo: decide if > $logfile 2>&1 &

