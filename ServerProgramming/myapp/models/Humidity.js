var mongoose = require('mongoose');

var HumiditySchema = new mongoose.Schema({
    sensID: String,
    val: String,
    date: String
});

module.exports = mongoose.model('Humidity', HumiditySchema);
