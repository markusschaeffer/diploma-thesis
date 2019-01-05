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
    var txpoolQueue = txpool.status.pending;

    if (txpoolQueue == workload_size || txpoolQueue == 1) {
        if (eth.mining) {
            //console.log("== Already Mining/Sealing");
            return;
        }
        console.log("\n==mining/sealing started==\n");
        miner.start(mining_threads);
    }
    
    if (txpoolQueue == 0) {
        //stop mining
        if (eth.mining) {
            miner.stop();
            console.log("\n==mining/sealing stopped==\n");
        }
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