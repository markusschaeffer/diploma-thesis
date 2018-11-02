# Root file initiating bash scripts/processes

# Startup sequence:
# 1) Start all REST APIs: 
#		make master_start; make bootnode_start master_ip=IP; ; make node_start master_ip=IP
# 2) Start Bootnode and Netstats via startBootnodeAndNetstats.js in scripts/js/communication
# 3) Start GETH clients via startGethOnNodes.js in scripts/js/communication
# 4) Deploy desired smart contract scenario via deployContract.js in scripts/js/communication
# 5) Start benchmark via startBenchmark.js in scripts/js/communication

####################VARIABLES####################

current_dir = $(shell pwd)
genesisFile=`cat $(current_dir)/storage/current_genesis_node/current_genesis.txt`
target_gas_limit=`cat $(current_dir)/config/mining_settings/target_gas_limit.txt`
mining=`cat $(current_dir)/config/mining_settings/mining.txt`
bootnode_ip=`cat $(current_dir)/storage/ips/bootnode_ip.txt`
netstats_ip=`cat $(current_dir)/storage/ips/netstats_ip.txt`
geth_httpPort_node0=`cat $(current_dir)/config/ports/geth_http_port_node0.txt`
geth_httpPort_node1=`cat $(current_dir)/config/ports/geth_http_port_node1.txt`

####################AGGREGATED MAKE RULES####################

bootnode_start: 	start_rest_server_bootnode_netstats
master_start:		start_mongodb clear_IPs clear_mining_settings clear_benchmark_settings start_rest_server_master
node_start: 		start_rest_server_node

geth_start:			prepare geth_node0_startup 

prepare: kill_running_geth delete_root_folder init_folders delete_contract_addresses_storage_node

kill_running: kill_running_geth kill_running_bootnode kill_running_node

####################INITIAL INSTALLATION####################
install_node:
	cd scripts/sh; ./install_node.sh	

install_master:
	cd scripts/sh; ./install_master.sh	

####################INIT NODE FOLDERS####################
init_folders: delete_root_folder
	cd scripts/sh; sudo ./init_folders.sh 0
	cd scripts/sh; sudo ./init_folders.sh 1

delete_contract_addresses_storage_node:
	cd scripts/sh; sudo ./delete_contract_addresses_storage_node.sh 

delete_root_folder:
	cd scripts/sh; sudo ./delete_root_folder.sh 

####################ETH-NETSTATS AND ETH-NETSTATS-INTELLIGENCE-API####################
netstats:
	cd scripts/sh; sudo ./netstats.sh

####################BOOTNODE####################
bootnode:
	cd scripts/sh; sudo ./bootnode.sh
	
####################GENESIS####################
genesis_create:
	cd scripts/sh; sudo ./genesis_create.sh
	
####################GETH NODES####################
#node_startup.sh
#$1: index of node
#$2: ip of eth-netstats server
#$3: ip of bootnode
#$4: path to genesis.json file
#$5: name of genesis.json

geth_node0_startup:
	cd scripts/sh; sudo ./node_startup.sh 0 $(netstats_ip) $(bootnode_ip) $(current_dir)/genesis_json_files/$(genesisFile) $(genesisFile) $(target_gas_limit) $(mining)

geth_node0_stop:
	cd scripts/sh; sudo ./node_stop.sh 0

geth_node0_resume:
	cd scripts/sh; sudo ./node_resume.sh 0

geth_node1_startup:
	cd scripts/sh; sudo ./node_startup.sh 1 $(netstats_ip) $(bootnode_ip) $(current_dir)/genesis_json_files/$(genesisFile) $(genesisFile) $(target_gas_limit) $(mining)

geth_node1_stop:
	cd scripts/sh; sudo ./node_stop.sh 1

geth_node1_resume:
	cd scripts/sh; sudo ./node_resume.sh 1

geth_nodes_startup: geth_node0_startup geth_node1_startup

geth_nodes_stop: geth_node0_stop geth_node1_stop

geth_nodes_resume: geth_node0_resume geth_node1_resume

####################SMART CONTRACTS DEPLOYMENT & BENCHMARK####################
sc_deploy_accounts: delete_contract_addresses_storage_node
	cd scripts/js/deployment; node account.js
	cd scripts/js/deployment; node account.js

sc_run_accounts_node0:
	cd scripts/js/benchmark; sudo node account_benchmark_approach3.js $(geth_httpPort_node0) $(maxTransactions) $(maxRuntime) $(address1) $(address2) $(benchmarkID)

sc_run_accounts_node1:
	cd scripts/js/benchmark; node account_benchmark_approach3.js $(geth_httpPort_node1) $(maxTransactions) $(maxRuntime) $(address1) $(address2) $(benchmarkID)

sc_deploy_ballot: delete_contract_addresses_storage_node
	cd scripts/js/deployment; node ballot.js

sc_run_ballot_node0:
	cd scripts/js/benchmark; sudo node ballot_benchmark_approach3.js $(geth_httpPort_node0) $(maxTransactions) $(maxRuntime) $(address) $(benchmarkID)

sc_run_ballot_node1:
	cd scripts/js/benchmark; node ballot_benchmark_approach3.js $(geth_httpPort_node1) $(maxTransactions) $(maxRuntime) $(address) $(benchmarkID)

####################COMMUNICATION####################
start_rest_server_master:
	cd scripts/js/communication/restfulAPI/master/; node server_master.js

start_rest_server_node:
	cd scripts/js/communication/restfulAPI/node/; node server_node.js $(master_ip) $(mode)

start_rest_server_bootnode_netstats:
	cd scripts/js/communication/restfulAPI/bootnode-netstats/; node server_bootnode-netstats.js $(master_ip) $(mode)

####################DATABASE####################
start_mongodb:
	cd scripts/sh; sudo ./start_mongoDB.sh

####################UTIL####################
attach_cli_node0:
	cd scripts/sh; sudo ./attach.sh 0

attach_cli_node1:
	cd scripts/sh; sudo ./attach.sh 1
	
kill_running_geth:
	cd scripts/sh; sudo ./kill_running_geth.sh;

kill_running_bootnode:
	cd scripts/sh; sudo ./kill_running_bootnode.sh;

kill_running_node:
	cd scripts/sh; sudo ./kill_running_node.sh;  

clear_IPs:
	cd storage/ips; sudo rm nodes_ip.txt; touch nodes_ip.txt;
	cd storage/ips; sudo rm bootnode_ip.txt; touch bootnode_ip.txt;
	cd storage/ips; sudo rm netstats_ip.txt; touch netstats_ip.txt;

clear_mining_settings:
	cd config/mining_settings; sudo rm mining.txt; touch mining.txt;

clear_benchmark_settings:
	cd config/benchmark_settings; sudo rm benchmark_start.txt; touch benchmark_start.txt;