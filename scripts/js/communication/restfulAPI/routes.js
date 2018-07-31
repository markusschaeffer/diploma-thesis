/**
 * REST routes
 */
module.exports = (app) => {
    let controller = require('./controller');

    /**
     * get the peers count of geth instances (connected nodes that know about each other)
     */
    app.route('/peer-count')
        .get(controller.getPeerCount);

    /**
     * deploy a contract
     */
    app.route('/contract-deploy')
        .post(controller.deployContract);

    /**
     * initate the start of a benchmark
     */
    app.route('/benchmark-start')
        .post(controller.startBenchmark);

    /**
     * log/store a benchmark result
     */
    app.route('/benchmark-log')
        .post(controller.logBenchmark);

}