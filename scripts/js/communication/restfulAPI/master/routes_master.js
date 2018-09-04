/**
 * REST routes (local)
 */
module.exports = (app) => {
    let controller = require('./controller_master');

    /**
     * log/store a benchmark result
     */
    app.route('/local-benchmark-log')
        .post(controller.logBenchmark);

}