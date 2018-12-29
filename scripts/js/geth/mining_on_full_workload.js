/**
 * Script for modifying Geths behaviour
 * 
 * Start mining if the full workload is in the pending queue
 * If all transactions have been mined/sealed (no transactions in the pending queue) stop mining/sealing
 * 
 */

var mining_threads = 32
var workload_size = 1000

function checkWork() {

    //start mining
    if (txpool.status.pending == workload_size || txpool.status.pending == 1) {
        if (eth.mining) {
            //console.log("== Already Mining/Sealing");
            return;
        }
        //console.log("== Full Queue ! Starting to Mine/Seal");
        miner.start(mining_threads);
    }

    //stop mining
    if (txpool.status.pending == 0) {
        miner.stop();
        //console.log("== No transactions! Mining stopped.");
    }
}

//check for each latest and pending event
eth.filter("latest", function (err, block) {
    checkWork();
});
eth.filter("pending", function (err, block) {
    checkWork();
});

checkWork();