var mongoose = require('mongoose');

var DinSchema = new mongoose.Schema({
    statusCode: String,
    statusDesc: String,
    pin: String,
    data: [{
        sensID: String,
        val: String,
        date: String
    }]
});

module.exports = mongoose.model('Gyroscope', GyroscopeSchema);
