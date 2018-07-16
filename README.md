
# Framework for Benchmarking the Performance of differently configured private Ethereum networks

This is the repository for my diploma-thesis related to Ethereum performance and scalability measurements.
The goal is to benchmark metrics such as transactions per second and delay of transactions with regards to differently configured Ethereum networks.
Parameters of these Ethereum networks are, for example, different consensus algorithms (pow, poa) and their specific parameters (e.g. minign difficulty @ pow, number of miners etc.), the amount of Ethereum nodes participating i the network etc.

# Attention: This is still WORK IN PROGRESS!

### Errors/Issues
-Communication
-- MongoDB model

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