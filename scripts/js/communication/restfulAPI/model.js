/*
You’ll need to have MongoDB server installed locally, if you want to serve your database.
https://medium.com/ph-devconnect/build-your-first-restful-api-with-node-js-e701b53d1f41
*/

/*
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let TaskSchema = new Schema({
    name: {
        type: String,
        Required: 'Task label is required!'
    },
    Created_date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: [{
            type: String,
            enum: ['completed', 'ongoing', 'pending']
        }],
        default: ['pending']
    }
});

module.exports = mongoose.model('Tasks', TaskSchema);
*/