var mongoose = require('mongoose');

var GyroscopeSchema = new mongoose.Schema({
    statusCode: String,
    statusDesc: String,
    data: [{
        sensID: String,
        val_x: String,
        val_y: String,
        val_z: String,
        date: String
    }],
});

module.exports = mongoose.model('Gyroscope', GyroscopeSchema);
