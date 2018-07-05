#RUN THIS MAKEFILE WITH "sudo make ...."

#https://github.com/ethereum/go-ethereum/wiki/Command-Line-Options

run_full: init_folders netstats bootnode nodes_startup_full
	 
run_without_netstats: init_folders bootnode nodes_startup_full
 
####################INITIAL INSTALLATION####################
install_packages:
	cd scripts/sh; ./install.sh

time_sync_install_and_run:
	sudo apt-get update
	sudo apt-get install ntp
	sudo service ntp start
	@echo "Time sync started"

####################INIT NODE FOLDERS####################
init_folders: delete_contract_addresses
	cd scripts/sh; sudo ./init_folders.sh 0
	cd scripts/sh; sudo ./init_folders.sh 1

delete_contract_addresses:
	rm -rf storage/contract_addresses
	cd storage; mkdir contract_addresses	

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
	cd scripts/sh; sudo ./node_startup.sh 0 127.0.0.1 127.0.0.1 ~/Dropbox/UbuntuVM/DropboxShared/diploma-thesis/genesis_json_files/pow/genesis1.json

node1_startup_full:
	cd scripts/sh; sudo ./node_startup.sh 1 127.0.0.1 127.0.0.1 ~/Dropbox/UbuntuVM/DropboxShared/diploma-thesis/genesis_json_files/pow/genesis1.json

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

####################SMART CONTRACTS DEPLOYMENT####################

sc_deploy_accounts: delete_contract_addresses;
	cd smart_contracts/account; rm -rf target; bash compile_account.sh;
	cd scripts/js/deployment; node account.js;
	cd scripts/js/deployment; node account.js;

####################SMART CONTRACTS BENCHMARK####################

sc_run_with_deploy: sc_deploy_accounts
	cd scripts/js/benchmark; node account_benchmark.js;