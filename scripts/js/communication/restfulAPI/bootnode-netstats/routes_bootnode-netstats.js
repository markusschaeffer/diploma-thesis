/**
 * REST routes (bootnode-netstats)
 */
module.exports = (app) => {
    let controller = require('./controller_bootnode-netstats');

    /**
     * start a bootnode
     */
    app.route('/bootnode-start')
        .post(controller.startBootnode);

    /**
     * start eth-netstats
     */
    app.route('/netstats-start')
        .post(controller.startNetstats);

}