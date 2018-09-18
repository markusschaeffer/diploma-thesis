/**
 * REST routes (master)
 */
module.exports = (app) => {
    let controller = require('./controller_master');

    /**
     * log/store a benchmark result
     */
    app.route('/master-benchmark-log')
        .post(controller.logBenchmark);

    /**
     * store a contract address
     */
    app.route('/master-contract-address-receive')
        .post(controller.storeContractAddress);
}