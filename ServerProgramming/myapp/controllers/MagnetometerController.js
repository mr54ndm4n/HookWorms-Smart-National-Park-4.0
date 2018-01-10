var mongoose = require("mongoose");
var Magnetometer = require("../models/Magnetometer");

var magnetometerController = {};

// Show list of magnetometer
magnetometerController.list = function(req, res) {
    console.log("List Magnetometer");
    Magnetometer.find({}).exec(function (err, magnetometer) {
        if (err) {
            console.log("Error:", err);
        }
        else {
            console.log(magnetometer[0].data);
            res.render("../views/magnetometer", {title: "Magnetometer", magnetometer: magnetometer[0].data});
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
            console.log("Successfully created an Magnetometer with " + t.data.length + " datas");
        }
    })
};

module.exports = magnetometerController;
