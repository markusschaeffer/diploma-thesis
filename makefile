# Root file initiating bash scripts/processes

# Startup sequence:
# 0) Specify IPs of bootnode, eth-netstats, master and geth-nodes in storage/ips/
# 1) Start several processes needed: 
#	make prepare; make bootnode_start; make master_start; make node_start
# 2) Deploy desired smart contract scenario: 
#	e.g. via "sudo make deploy_accounts"
# 	or deploy via REST communication in folder scripts/js/
# 3) Start benchmark: 
#	e.g. via "sudo make sc_run_accounts_without_deploy_node0 $(maxTransactions) $(maxRuntime) $(address1) $(address1) $(benchmarkID)" 
#	or start via REST communication in folder scripts/js/

####################VARIABLES####################

current_dir = $(shell pwd)
genesisFile=`cat $(current_dir)/storage/current_genesis/current_genesis`
netstats_ip=`cat $(current_dir)/storage/ips/netstats_ip`
bootnode_ip=`cat $(current_dir)/storage/ips/bootnode_ip`

####################AGGREGATED MAKE RULES####################

prepare: kill_running delete_root_folder init_folders delete_contract_addresses_storage delete_current_genesis_storage
bootnode_start: 	netstats bootnode
master_start:		start_mongodb start_rest_server_master
node_start: 		geth_node0_startup start_rest_server_node

####################INITIAL INSTALLATION####################
install_node:
	cd scripts/sh; ./install_node.sh	

install_master:
	cd scripts/sh; ./install_master.sh	

####################INIT NODE FOLDERS####################
init_folders: delete_root_folder
	cd scripts/sh; sudo ./init_folders.sh 0
	cd scripts/sh; sudo ./init_folders.sh 1

delete_contract_addresses_storage:
	cd scripts/sh; sudo ./delete_contract_addresses_storage.sh 

delete_current_genesis_storage:
	cd scripts/sh; sudo ./delete_current_genesis_storage.sh 

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
	cd scripts/sh; sudo ./node_startup.sh 0 $(netstats_ip) $(bootnode_ip) $(current_dir)/genesis_json_files/$(genesisFile) $(genesisFile)

geth_node0_stop:
	cd scripts/sh; sudo ./node_stop.sh 0

geth_node0_resume:
	cd scripts/sh; sudo ./node_resume.sh 0

geth_node1_startup:
	cd scripts/sh; sudo ./node_startup.sh 1 $(netstats_ip) $(bootnode_ip) $(current_dir)/genesis_json_files/$(genesisFile) $(genesisFile)

geth_node1_stop:
	cd scripts/sh; sudo ./node_stop.sh 1

geth_node1_resume:
	cd scripts/sh; sudo ./node_resume.sh 1

geth_nodes_startup: geth_node0_startup geth_node1_startup

geth_nodes_stop: geth_node0_stop geth_node1_stop

geth_nodes_resume: geth_node0_resume geth_node1_resume

####################SMART CONTRACTS DEPLOYMENT & BENCHMARK####################
sc_deploy_accounts: delete_contract_addresses_storage
	cd smart_contracts/account; rm -rf target; bash compile_account.sh
	cd scripts/js/deployment; node account.js
	cd scripts/js/deployment; node account.js

sc_run_accounts_node0:
	cd scripts/js/benchmark; sudo node account_benchmark_approach3.js 8100 $(maxTransactions) $(maxRuntime) $(address1) $(address1) $(benchmarkID)

sc_run_accounts_node1:
	cd scripts/js/benchmark; node account_benchmark_approach3.js 8101 $(maxTransactions) $(maxRuntime) $(address1) $(address2) $(benchmarkID)

####################COMMUNICATION####################
start_rest_server_master:
	cd scripts/js/communication/restfulAPI/master/; node server_master.js

start_rest_server_node:
	cd scripts/js/communication/restfulAPI/node/; node server_node.js

####################DATABASE####################
start_mongodb:
	cd scripts/sh; sudo ./start_mongoDB.sh

####################UTIL####################
attach_cli_node0:
	cd scripts/sh; sudo ./attach.sh 0

attach_cli_node1:
	cd scripts/sh; sudo ./attach.sh 1

kill_running:
	cd scripts/sh; sudo ./kill_running.sh
