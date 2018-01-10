var mongoose = require('mongoose');

var TemperatureSchema = new mongoose.Schema({
    statusCode: String,
    statusDesc: String,
    data: [{
        sensID: String,
        val: String,
        date: String
    }],
});

module.exports = mongoose.model('Temperature', TemperatureSchema);
