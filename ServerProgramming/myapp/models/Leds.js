var mongoose = require('mongoose');

var LedsSchema = new mongoose.Schema({
    sensID: String,
    val: String,
    date: String
});

module.exports = mongoose.model('Leds', LedsSchema);