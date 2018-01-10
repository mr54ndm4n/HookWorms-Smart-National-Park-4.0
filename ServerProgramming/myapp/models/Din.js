var mongoose = require('mongoose');

var DinSchema = new mongoose.Schema({
    sensID: String,
    val: String,
    date: String,
    pin: String
});

module.exports = mongoose.model('Gyroscope', DinSchema);
