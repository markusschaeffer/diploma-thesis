
# Framework for Benchmarking the Performance of Differently Configured Private Ethereum Networks (using Geth)

This is the repository for my diploma-thesis, which is related to Ethereum performance and scalability measurements.
The goal is to benchmark metrics of differently configured Ethereum networks.

# Attention: This is still WORK IN PROGRESS!

# Concept

## Ethereum Network Parameters
- Consensus Algorithm
    - Proof of Work (Ethash)
        - Mining Difficulty
        - Block gas limit
        - Number of miners in the network
        - Quantity of minerthreads
    - Proof of Authority (Clique)
        - Period
        - Block gas limit
        - Number of sealers in the network    
- Number of nodes in the network
- Power of nodes in the network (CPU, RAM) 
- Blockchain sync mode ("fast", "full", or "light")
- Further performance tuning options of the GETH client (e.g. Megabytes of memory allocated to internal caching)

## Metrics
- Throughput: the number of successful transactions per second.
- Latency: the difference between the completion time and the deployment time
- Scalability: measured as the changes in throughput and latency when increasing number and size of nodes

## Scenarios
- Simple transfer of ETH between two smart contracts
- Voting (ballot.sol)
- Reading and writing from/to a simple contract consisting mainly of getter and setter methods

# Architecture

![Architecture](architecture_overview.png)

## TODO
- ReadWrite scenario implementation
- Increase Number of Open File Descriptors for EC2 Instances?
- Amazon CloudFormation Service Templates for automatic node startup with "scripts/sh/install_node.sh"
- Visualization of benchmark results via Python (matplotlib)

## AWS EC2 Startup Procedure

- Start a node with a geth bootnode and eth-netstats (automatic startup, not via REST api)
- Save the IP of the bootnode to the storage folder and push to repo
- Start other nodes (running geth and the REST api)
- Deploy smart contract scenario from the master node (via REST)
- Start benchmarks from master node (via REST)
- Benchmark results are stored on the master DB

## Local MongoDB
 - start via "mongo" 
- select last entries descending on startTime: "db.benchmarklogs.find().pretty().sort({"startTime":-1})"