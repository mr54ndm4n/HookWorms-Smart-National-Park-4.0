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
            if(req.body.datetime_start && req.body.datetime_stop){t = t.filter(accelerometer => utils.compareTimeLength(accelerometer["date"], req.body.datetime_start, req.body.datetime_stop))}
            res.render("../views/accelerometer", {title: "Accelerometer", accelerometer: t.slice(0, 200), datetime_start: req.body.datetime_start, datetime_stop: req.body.datetime_stop});
        }
    });
};

accelerometerController.listJson = function(start, stop){
    return new Promise(function(resolve, reject) {
        console.log("List Accelerometer");
        Accelerometer.find({}).exec(function (err, accelerometer_list) {
            if (err) {console.log("Error:", err);}
            else {
                let t = accelerometer_list;
                resolve(t.filter(accelerometer => utils.compareTimeLength(accelerometer["date"], start, stop)))
            }
        });
    });
};

// Save new accelerometer
accelerometerController.save = function(t, teamID) {
    // console.log("Create Accelerometer");
    t["teamID"] = teamID;
    var accelerometer = new Accelerometer(t);
    accelerometer.save(function(err){
        if(err) {
            console.log(err);
        } else {
            // console.log("Successfully created an Accelerometer");
        }
    })
};

module.exports = accelerometerController;
