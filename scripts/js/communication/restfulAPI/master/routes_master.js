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

    /**
     * store the bootnode ip
     */
    app.route('/master-store-ip-bootnode')
    .post(controller.storeBootnodeIP);

    /**
     * store the netstats ip
     */
    app.route('/master-store-ip-netstats')
    .post(controller.storeNetstatsIP);

    /**
     * store a node ip
     */
    app.route('/master-store-ip-node')
    .post(controller.storeNodeIP);


}