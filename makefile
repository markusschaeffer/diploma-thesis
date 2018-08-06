#RUN THIS FILE WITH "sudo make genesisFile=... maxRuntime=... maxTransactions=..."

#genesisFile=genesis_poa_period_1.json
genesisFile=genesis_pow_difficulty_0x400_gasLimit_double.json
#maxRuntime=10
#maxTransactions=1000
netstats_ip=127.0.0.1
bootnode_ip=127.0.0.1

current_dir = $(shell pwd)

####################AGGREGATED MAKE RULES####################

run_full: 				kill_running delete_root_folder init_folders delete_contract_addresses_storage delete_current_genesis_storage netstats bootnode node0_startup_full start_mongodb start_rest_server
run_without_netstats: 	kill_running delete_root_folder init_folders delete_contract_addresses_storage delete_current_genesis_storage bootnode node0_startup_full start_mongodb start_rest_server
 
node_start: kill_running delete_root_folder init_folders delete_contract_addresses_storage delete_current_genesis_storage node0_startup_full
node_start_incl_db_rest: node_start start_mongodb start_rest_server

####################INITIAL INSTALLATION####################
install_packages:
	cd scripts/sh; ./install.sh

time_sync_install_and_run:
	sudo apt-get update
	sudo apt-get install ntp
	sudo service ntp start
	@echo "Time sync started"

####################UTIL####################
attach_cli_node0:
	cd scripts/sh; sudo ./attach.sh 0

attach_cli_node1:
	cd scripts/sh; sudo ./attach.sh 1

kill_running:
	cd scripts/sh; sudo ./kill_running.sh

####################INIT NODE FOLDERS####################
init_folders: delete_root_folder
	cd scripts/sh; sudo ./init_folders.sh 0
	cd scripts/sh; sudo ./init_folders.sh 1

delete_contract_addresses_storage:
	rm -rf storage/contract_addresses_server
	cd storage; mkdir contract_addresses_server	

delete_current_genesis_storage:
	rm -rf storage/current_genesis_server
	cd storage; mkdir current_genesis_server	

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
#$1 index of node
#$2 ip of eth-netstats server
#$3 ip of bootnode
#$4 path to genesis.json file

node0_startup_full:
	cd scripts/sh; sudo ./node_startup.sh 0 $(netstats_ip) $(bootnode_ip) $(current_dir)/genesis_json_files/$(genesisFile) $(genesisFile)

node1_startup_full:
	cd scripts/sh; sudo ./node_startup.sh 1 $(netstats_ip) $(bootnode_ip) $(current_dir)/genesis_json_files/$(genesisFile) $(genesisFile)

node0_stop:
	cd scripts/sh; sudo ./node_stop.sh 0

node1_stop:
	cd scripts/sh; sudo ./node_stop.sh 1

node0_resume:
	cd scripts/sh; sudo ./node_resume.sh 0

node1_resume:
	cd scripts/sh; sudo ./node_resume.sh 1

nodes_startup_full: node0_startup_full node1_startup_full

nodes_stop: node0_stop node1_stop

nodes_resume: node0_resume node1_resume

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