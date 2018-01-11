var express = require('express');
var router = express.Router();
var predictedData = require("../controllers/PredictedDataController.js");

/* GET home page. */
router.get('/', function(req, res, next) {
    res.locals.team_id = null;
    res.locals.description = null;
    res.render('predicted_data')
});
router.post('/', function(req, res, next) {
    //Add to DB
    let data = {team_id: req.body.team_id, description: req.body.description}
    predictedData.save(data)
    res.send("Data Accepted" + JSON.stringify(data));
});


module.exports = router;
