
# Framework for Benchmarking the Performance of Differently Configured Private Ethereum Networks (using Geth)

This is the repository for my diploma-thesis, which is related to Ethereum performance and scalability measurements.
The goal is to benchmark metrics of differently configured Ethereum networks.

# Attention: This is still WORK IN PROGRESS!

# Concept

## Ethereum Network Parameters
- Consensus Algorithm
    - Proof of Work (Ethash)
        - Mining difficulty
        - Number of miners in the network
    - Proof of Authority (Clique)
        - Period
        - Number of sealers in the network    
- Block gas limit
- Number of nodes in the network
- Power of nodes in the network (CPU, RAM) 

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
- Amazon CloudFormation Service Templates for automatic node startup with "scripts/sh/install_node.sh"
- Visualization of benchmark results via Python (matplotlib)
- ReadWrite scenario implementation

## AWS EC2 Startup Procedure

- Start REST API and mongoDB on master
- Start REST API on bootnode/netstats
- Start bootnode and netstats via REST command (send from master to bootnode/netstats)
- Start REST API on nodes
- Start Geth on nodes via REST command
- Deploy smart contract scenario on a node (from master via REST communication)
- Start benchmarks from master node (via REST)
- Benchmark results are stored on the master DB (send via REST from nodes to master)

## Local MongoDB
- start via "mongo" 
- select last entries descending on startTime: "db.benchmarklogs.find().pretty().sort({"startTime":-1})"