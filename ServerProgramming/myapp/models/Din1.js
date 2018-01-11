var mongoose = require('mongoose');

var DinSchema = new mongoose.Schema({
    teamID: String,
    sensID: String,
    val: String,
    date: {type: Date}
});

module.exports = mongoose.model('Din1', DinSchema);
