#RUN THIS FILE WITH "sudo make ...."

genesisFile=genesis_pow_difficulty_0x400_gasLimit_double.json

benchmark_full: run_full sc_deploy_accounts sc_run_accounts_without_deploy_node0

run_full: kill_running delete_root_folder init_folders delete_contract_addresses netstats bootnode nodes_startup_full start_rest_server
	 
run_without_netstats: kill_running delete_root_folder init_folders delete_contract_addresses bootnode nodes_startup_full start_rest_server
 
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

delete_contract_addresses:
	rm -rf storage/contract_addresses
	cd storage; mkdir contract_addresses	

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
	
####################NODES####################
#node_startup.sh
#$1 index of node
#$2 ip of eth-netstats server
#$3 ip of bootnode
#$4 path to genesis.json file

node0_startup_full:
	cd scripts/sh; sudo ./node_startup.sh 0 127.0.0.1 127.0.0.1 ~/Dropbox/UbuntuVM/DropboxShared/diploma-thesis/genesis_json_files/$(genesisFile)

node1_startup_full:
	cd scripts/sh; sudo ./node_startup.sh 1 127.0.0.1 127.0.0.1 ~/Dropbox/UbuntuVM/DropboxShared/diploma-thesis/genesis_json_files/$(genesisFile)

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

sc_deploy_accounts: delete_contract_addresses
	cd smart_contracts/account; rm -rf target; bash compile_account.sh
	cd scripts/js/deployment; node account.js
	cd scripts/js/deployment; node account.js

sc_run_accounts_without_deploy_node0:
	cd scripts/js/benchmark; sudo node account_benchmark_approach3.js 8100 $(genesisFile) 100 10

sc_run_accounts_without_deploy_node1:
	cd scripts/js/benchmark; node account_benchmark_approach3.js 8101 $(genesisFile) 1000 10

sc_run_accounts_with_deploy_all_nodes: sc_deploy_accounts sc_run_accounts_without_deploy_all_nodes

sc_run_accounts_without_deploy_all_nodes: sc_run_accounts_without_deploy_node0 sc_run_accounts_without_deploy_node1


####################COMMUNICATION####################

start_rest_server:
	cd scripts/js/communication/restfulAPI/; node server.js