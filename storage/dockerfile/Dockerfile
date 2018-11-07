From ubuntu:16.04

RUN 	apt-get update && \
	apt-get install sudo && \
	apt-get install -y make && \
	apt-get install -y git

RUN	cd ~ && \ 	
	git clone https://github.com/markusschaeffer/diploma-thesis.git && \
	cd diploma-thesis && \
	sudo make install_node
