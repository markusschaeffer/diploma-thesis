
# Framework for Benchmarking the Performance of differently configured private Ethereum networks

This is the repository for my diploma-thesis, which is  related to Ethereum performance and scalability measurements.
The goal is to benchmark metrics of differently configured Ethereum networks.

# Attention: This is still WORK IN PROGRESS!

# Concept

## Ethereum Network Parameters (so far)
- Consenus Algoithm
    - Proof of Work (Ethash)
        - Mining Difficulty
        - Block gas limit
        - Number of miners in the network
        - Amount of minerthreads
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
- Reading and writing from/to a simple contract holdin getter and setter methods

# Errors/Issues

- Errors
-- UnhandledPromiseRejectionWarning: Error: Returned error: known transaction
    at emitNone (events.js:111:20)
    at IncomingMessage.emit (events.js:208:7)
    at endReadableNT (_stream_readable.js:1064:12)
    at _combinedTickCallback (internal/process/next_tick.js:138:11)
    at process._tickCallback (internal/process/next_tick.js:180:9)
-- ERROR[07-05|16:14:33] Transaction referenced missing 
-- "Error: Failed to check for transaction receipt:

- eth-netstats
-- transactions are not listed on the eth-netstats frontend