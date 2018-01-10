var mongoose = require('mongoose');

var PressureSchema = new mongoose.Schema({
    sensID: String,
    val: String,
    date: String
});

module.exports = mongoose.model('Pressure', PressureSchema);
