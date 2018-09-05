# !/bin/bash
# modified script of https://github.com/ethersphere/eth-utils.git

# 	bash netstatsconf.sh <number_of_clusters> <name_prefix> <ws_server> <ws_secret>
#e.g. 	bash netstatconf.sh $AMOUNT_NODES $PREFIX http://localhost:3000 $WSSECRET > app.json;

# sets up a eth-net-intelligence app.json for a local ethereum network cluster of nodes
# - <number_of_clusters> is the number of clusters
# - <name_prefix> is a prefix for the node names as will appear in the listing
# - <ws_server> is the eth-netstats server
# - <ws_secret> is the eth-netstats secret
#

N=$1
name_prefix=$2
ws_server=$3
ws_secret=$4

#app.json format
#https://medium.com/@jake.henningsgaard/monitoring-the-ethereum-blockchain-24384064fad3

#"env":
#	{
#		"NODE_ENV"        : "production", // tell the client we're in production environment
#		"RPC_HOST"        : "localhost", // eth JSON-RPC host
#		"RPC_PORT"        : "8545", // eth JSON-RPC port
#		"LISTENING_PORT"  : "30303", // eth listening port (only used for display)
#		"INSTANCE_NAME"   : "", // whatever you wish to name your node
#		"CONTACT_DETAILS" : "", // add your contact details here if you wish (email/skype)
#		"WS_SERVER"       : "wss://rpc.ethstats.net", // path to eth-netstats WebSockets api server
#		"WS_SECRET"       : "", // WebSockets api server secret used for login
#	}

echo -e "["

#################################TODO#########################################
#GET VALUES FROM IPS.txt
#change RPC_HOST -> IP of AWS instance
#change RPC_PORT -> Port of node on instance

for ((i=0;i<N;++i)); do
    id=`printf "%02d" $i`
    single_template="  {\n    \"name\"        : \"$name_prefix-$i\",\n    \"cwd\"         : \".\",\n    \"script\"      : \"app.js\",\n    \"log_date_format\"   : \"YYYY-MM-DD HH:mm Z\",\n    \"merge_logs\"    : false,\n    \"watch\"       : false,\n    \"exec_interpreter\"  : \"node\",\n    \"exec_mode\"     : \"fork_mode\",\n    \"env\":\n    {\n      \"NODE_ENV\"    : \"production\",\n      \"RPC_HOST\"    : \"localhost\",\n      \"RPC_PORT\"    : \"81$id\",\n      \"INSTANCE_NAME\"   : \"$name_prefix-$i\",\n      \"WS_SERVER\"     : \"$ws_server\",\n      \"WS_SECRET\"     : \"$ws_secret\",\n    }\n  }"

    endline=""
    if [ "$i" -ne "$N" ]; then
        endline=","
    fi
    echo -e "$single_template$endline"
done

echo "]"
