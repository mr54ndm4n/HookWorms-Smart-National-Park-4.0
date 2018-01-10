var mongoose = require("mongoose");
var Gyroscope = require("../models/Gyroscope");

var gyroscopeController = {};

// Show list of gyroscope
gyroscopeController.list = function(req, res) {
    console.log("List Gyroscope");
    Gyroscope.find({}).exec(function (err, gyroscope) {
        if (err) {
            console.log("Error:", err);
        }
        else {
            console.log(gyroscope[0].data);
            res.render("../views/gyroscope", {title: "Gyroscope", gyroscope: gyroscope[0].data});
        }
    });
};

// Save new gyroscope
gyroscopeController.save = function(t) {
    console.log("Create Gyroscope");
    var gyroscope = new Gyroscope(t);
    gyroscope.save(function(err){
        if(err) {
            console.log(err);
        } else {
            console.log("Successfully created an Gyroscope with " + t.data.length + " datas");
        }
    })
};

module.exports = gyroscopeController;
