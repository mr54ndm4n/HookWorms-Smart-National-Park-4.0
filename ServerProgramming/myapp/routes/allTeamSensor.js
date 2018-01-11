var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var request = require('request');
var https = require('https');
var rp = require('request-promise');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));

const CATurl = "http://10.0.0.10";
var temperature = require("../controllers/TemperatureController.js");
var accelerometer = require("../controllers/AccelerometerController.js");
var din1 = require("../controllers/Din1Controller.js");



router.get('/:start/:end', function(req, res, next) {
    var getData = [];
    var start = req.params.start;
    var stop = req.params.end;
    getData.push(temperature.listJson(start, stop));
    getData.push(accelerometer.listJson(start, stop));
    getData.push(din1.listJson(start, stop));
    Promise.all(getData).then(function(res_data){
        console.log("Hi");
        var data = {
            temperature: res_data[0],
            accelerometer: res_data[1],
            din1: res_data[2]
        }
        console.log(data);
        res.send(data)
    }).catch(function (err) {
        console.log("Error" + err);
    });
});

module.exports = router;
