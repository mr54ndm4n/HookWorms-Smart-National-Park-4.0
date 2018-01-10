var mongoose = require("mongoose");
var utils = require("../Utils");
var Magnetometer = require("../models/Magnetometer");

var magnetometerController = {};

// Show list of magnetometer
magnetometerController.list = function(req, res) {
    console.log("List Magnetometer");
    Magnetometer.find({}).exec(function (err, magnetometer_list) {
        if (err) {console.log("Error:", err);}
        else {
            let t = magnetometer_list;
            if(req.body.datetime){t = t.filter(magnetometer => utils.compareTime(req.body.datetime, magnetometer["date"]))}
            res.render("../views/magnetometer", {title: "Magnetometer", magnetometer: t, datetime: req.body.datetime});
        }
    });
};


// Save new magnetometer
magnetometerController.save = function(t) {
    console.log("Create Magnetometer");
    var magnetometer = new Magnetometer(t);
    magnetometer.save(function(err){
        if(err) {
            console.log(err);
        } else {
            console.log("Successfully created an Magnetometer");
        }
    })
};

module.exports = magnetometerController;
