/**
 * REST routes (node)
 */

module.exports = (app) => {
    let controller = require('./controller_node');

    /**
     * restart the geth-node
     */
    app.route('/node-geth-start')
        .post(controller.startGeth);

    /**
     * get the peers count (connected geth nodes that know about each other)
     */
    app.route('/node-peer-count')
        .get(controller.getPeerCount);

    /**
     * deploy a contract
     */
    app.route('/node-contract-deploy')
        .post(controller.deployContract);

    /**
     * initate the start of a benchmark
     */
    app.route('/node-benchmark-start')
        .post(controller.startBenchmark);    
}