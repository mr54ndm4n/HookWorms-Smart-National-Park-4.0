var mongoose = require('mongoose');

var MagnetometerSchema = new mongoose.Schema({
    sensID: String,
    val_x: String,
    val_y: String,
    val_z: String,
    date: String
});

module.exports = mongoose.model('Magnetometer', MagnetometerSchema);
