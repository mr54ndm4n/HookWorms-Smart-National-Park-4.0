var mongoose = require("mongoose");
var Accelerometer = require("../models/Accelerometer");

var accelerometerController = {};

// Show list of accelerometer
accelerometerController.list = function(req, res) {
    console.log("List Accelerometer");
    Accelerometer.find({}).exec(function (err, accelerometer) {
        if (err) {
            console.log("Error:", err);
        }
        else {
            // console.log(accelerometer[0].data);
            res.render("../views/accelerometer", {title: "Accelerometer", accelerometer: accelerometer[0].data});
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
            console.log("Successfully created an Accelerometer with " + t.data.length + " datas");
        }
    })
};

module.exports = accelerometerController;
