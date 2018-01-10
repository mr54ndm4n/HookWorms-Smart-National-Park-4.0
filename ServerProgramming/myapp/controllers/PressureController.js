var mongoose = require("mongoose");
var utils = require("../Utils");
var Pressure = require("../models/Pressure");

var pressureController = {};

// Show list of pressure
pressureController.list = function(req, res) {
    console.log("List Pressure");
    Pressure.find({}).exec(function (err, pressure_list) {
        if (err) {console.log("Error:", err);}
        else {
            let t = pressure_list;
            if(req.body.datetime){t = t.filter(pressure => utils.compareTime(req.body.datetime, pressure["date"]))}
            res.render("../views/pressure", {title: "Pressure", pressure: t, datetime: req.body.datetime});
        }
    });
};

// Save new pressure
pressureController.save = function(t) {
    console.log("Create Pressure");
    var pressure = new Pressure(t);
    pressure.save(function(err){
        if(err) {
            console.log(err);
        } else {
            console.log("Successfully created an Pressure");
        }
    })
};

module.exports = pressureController;
