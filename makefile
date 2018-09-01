#RUN THIS FILE WITH "sudo make genesisFile=... maxRuntime=... maxTransactions=..."

#genesisFile=genesis_poa_period_1.json
genesisFile=genesis_pow_difficulty_0x400_gasLimit_double.json
#maxRuntime=10
#maxTransactions=1000
netstats_ip=127.0.0.1
bootnode_ip=127.0.0.1

current_dir = $(shell pwd)

####################AGGREGATED MAKE RULES####################

run_full: prepare bootnode_netstats_start node_start local_start

local_start: 				start_mongodb start_rest_server
bootnode_netstats_start: 	netstats bootnode
node_start: 				geth_node0_startup start_rest_server

prepare: kill_running delete_root_folder init_folders delete_contract_addresses_storage delete_current_genesis_storage

####################INITIAL INSTALLATION####################
install_node:
	cd scripts/sh; ./install_node.sh	

install_local:
	cd scripts/sh; ./install_local.sh	

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

sc_run_accounts_without_deploy_node0:
	cd scripts/js/benchmark; sudo node account_benchmark_approach3.js 8100 $(maxTransactions) $(maxRuntime) $(address1) $(address1)

sc_run_accounts_without_deploy_node1:
	cd scripts/js/benchmark; node account_benchmark_approach3.js 8101 $(maxTransactions) $(maxRuntime) $(address1) $(address2)

sc_run_accounts_with_deploy_all_nodes: sc_deploy_accounts sc_run_accounts_without_deploy_all_nodes

sc_run_accounts_without_deploy_all_nodes: sc_run_accounts_without_deploy_node0 sc_run_accounts_without_deploy_node1

####################COMMUNICATION####################
start_rest_server:
	cd scripts/js/communication/restfulAPI/; node server.js

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
