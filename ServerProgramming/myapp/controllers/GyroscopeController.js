var mongoose = require("mongoose");
var utils = require("../Utils");
var Gyroscope = require("../models/Gyroscope");

var gyroscopeController = {};

// Show list of gyroscope
gyroscopeController.list = function(req, res) {
    console.log("List Gyroscope");
    Gyroscope.find({}).exec(function (err, gyroscope_list) {
        if (err) {console.log("Error:", err);}
        else {
            let t = gyroscope_list;
            if(req.body.datetime){t = t.filter(gyroscope => utils.compareTime(req.body.datetime, gyroscope["date"]))}
            res.render("../views/gyroscope", {title: "Gyroscope", gyroscope: t, datetime: req.body.datetime});
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
            console.log("Successfully created an Gyroscope");
        }
    })
};

module.exports = gyroscopeController;
