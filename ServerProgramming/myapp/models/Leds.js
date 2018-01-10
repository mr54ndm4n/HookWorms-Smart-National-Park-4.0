var mongoose = require('mongoose');

var LedsSchema = new mongoose.Schema({
    statusCode: String,
    statusDesc: String,
    data: [{
        sensID: String,
        val: String,
        date: String
    }],
});

module.exports = mongoose.model('Leds', LedsSchema);