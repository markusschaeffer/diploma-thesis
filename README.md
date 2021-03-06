
# Framework for Measuring the Performance of Differently Configured Private Ethereum Networks (using Geth)

This is the repository for my diploma-thesis, which is related to Ethereum performance and scalability measurements.

# Concept

## Benchmark Parameters
- Block Frequency
    - Proof of Work (Ethash): mining difficulty
    - Proof of Authority (Clique): period
- Block size: gasLimit (genesis.json) and targetGasLimit (geth)
- Type of workload: smart contract (account, voting)
- Configuration of nodes in the network (CPU, RAM) (different AWS EC2 instances)
- Blockchain network size: amount of nodes in the network (1-20)

## Metrics
- Throughput: the number of successful transactions per second.
- Latency: the difference between the completion time and the deployment time
- Scalability: measured as the changes in throughput and latency when increasing number and size of nodes

## Scenarios
- Account (transfer of ETH between two smart contracts)
- Voting (modified ballot.sol)

# Architecture

![Architecture](architecture_overview.png)

## Startup Procedure for Measurements on AWS EC2 Instances
- Start a AWS Cloudformation Stack (use a template in aws_cloudformation_templates; Docker image https://hub.docker.com/r/markusschaeffer3011/diploma-thesis/ is executed)
- Start REST API and mongoDB on master (via "make master_start")
- Start bootnode and netstats (via REST: "node startBootnodeAndNetstats.js")
- Start Geth on nodes (via REST: "node startGethOnNodes.js")
- Deploy smart contract scenario (via REST: e.g. "node deployContracts.js account" or "node deployContracts.js ballot")
- Start benchmarks from master node (via REST: "node startBenchmark.js account" or "node startBenchmark.js ballot")
- Benchmark results are stored on the master DB (send via REST from nodes to master, mongo service needs to be running)

## Startup Procedure for Benchmarks on a Local Machine
- Start REST API and mongoDB on master (via "make master_start")
- Start REST API of bootnode and netstats (via "make bootnode_start mode=local")
- Start REST API of node (via "make node_start mode=local") 
- Start bootnode and netstats (via REST: "node startBootnodeAndNetstats.js")
- Start Geth on nodes (via REST: "node startGethOnNodes.js")
- Deploy smart contract scenario on a node (via REST: e.g. "node deployContracts.js account" or "node deployContracts.js ballot")
- Start benchmarks from master node (via REST: "node startBenchmark.js account" or "node startBenchmark.js ballot")
- Benchmark results are stored on the master DB (send via REST from nodes to master; mongo service needs to be running)

