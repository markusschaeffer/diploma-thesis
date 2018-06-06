#RUN THIS MAKEFILE WITH "sudo make ...."

#https://github.com/ethereum/go-ethereum/wiki/Command-Line-Options

run_full: init_folders netstats bootnode nodes_startup_full
	  
####################INITIAL INSTALLATION####################
install_packages:
	cd scripts/sh; ./install.sh

time_sync_install_and_run:
	sudo apt-get update
	sudo apt-get install ntp
	sudo service ntp start
	@echo "Time sync started"

####################INIT NODE FOLDERS####################
init_folders:
	cd scripts/sh; sudo ./init_folders.sh 0
	cd scripts/sh; sudo ./init_folders.sh 1

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
	cd scripts/sh; sudo ./node_startup.sh 0 127.0.0.1 127.0.0.1 ~/Dropbox/UbuntuVM/DropboxShared/diploma-thesis/genesis_json_files/pow/puppeth_default.json

node1_startup_full:
	cd scripts/sh; sudo ./node_startup.sh 1 127.0.0.1 127.0.0.1 ~/Dropbox/UbuntuVM/DropboxShared/diploma-thesis/genesis_json_files/pow/puppeth_default.json

nodes_startup_full: node0_startup_full node1_startup_full
