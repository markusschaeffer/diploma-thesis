/*
* Benchmarking related functions
*/

module.exports = {
    
    handleTransaction: function (transactionNumber){
        return new Promise(function(resolve, reject) {
          //setTimestapMap.set(i,timestamp('HH:mm:ss:ms'));
          console.log("started " + transactionNumber + " at " + timestamp('HH:mm:ss:ms'));
          timestampMapStart.set(transactionNumber, new Date());
          
          contract1.methods.transferEther(contract2.options.address, amountTobeSent).send({from: accountAddress})
          .on('transactionhash', function (hash){
            console.log(hash);
          })
          .on('receipt', function(receipt){
            //receipt = mined
            successfullTransactionCounter++;
            timestampMapStart.set(transactionNumber, new Date());
            console.log("finished " + transactionNumber + " at " + timestamp('HH:mm:ss:ms'));
            resolve(receipt);
          })
          .on('error', function (error){
            console.error(error);
            return reject(error);
          })
        });
    }
};