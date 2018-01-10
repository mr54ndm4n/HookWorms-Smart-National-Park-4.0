var mongoose = require("mongoose");
var utils = require("../Utils");
var Accelerometer = require("../models/Accelerometer");

var accelerometerController = {};

// Show list of accelerometer
accelerometerController.list = function(req, res) {
    console.log("List Accelerometer");
    Accelerometer.find({}).exec(function (err, accelerometer_list) {
        if (err) {console.log("Error:", err);}
        else {
            let t = accelerometer_list;
            if(req.body.datetime){t = t.filter(accelerometer => utils.compareTime(req.body.datetime, accelerometer["date"]))}
            res.render("../views/accelerometer", {title: "Accelerometer", accelerometer: t, datetime: req.body.datetime});
        }
    });
};

// Save new accelerometer
accelerometerController.save = function(t) {
    console.log("Create Accelerometer");
    var accelerometer = new Accelerometer(t);
    accelerometer.save(function(err){
        if(err) {
            console.log(err);
        } else {
            console.log("Successfully created an Accelerometer");
        }
    })
};

module.exports = accelerometerController;
