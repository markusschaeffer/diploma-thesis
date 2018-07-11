# diploma-thesis
Repository for my diploma-thesis related to Ethereum performance and scalability measurements


## Open Issues/ToDO:
- ERROR[07-05|16:14:33] Transaction referenced missing 
- "Error: Failed to check for transaction receipt:"

- Accept error: accept tcp 127.0.0.1:8545: too many open files
-https://github.com/ethereum/go-ethereum/issues/16079
- ==> 2k maximum transactions on a single node + reuse http connection and do not open a new one every time for each single transaction?

- sign transactions? and send in array?

- analyze http requests from web3 via wireshark tool?

- transactions not listed on eth-netstats

- idea for approach for sending transactions: query actual number of transactions on pending - if lower than X send new transactions until X transactions pending?