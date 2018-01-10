var mongoose = require('mongoose');

var PressureSchema = new mongoose.Schema({
    statusCode: String,
    statusDesc: String,
    data: [{
        sensID: String,
        val: String,
        date: String
    }],
});

module.exports = mongoose.model('Pressure', PressureSchema);
