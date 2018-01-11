var mongoose = require('mongoose');

var PredictedDataSchema = new mongoose.Schema({
    team_id: String,
    description: String,
    date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Predicted_data', PredictedDataSchema);
