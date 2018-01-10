var mongoose = require("mongoose");
var utils = require("../Utils");
var Temperature = require("../models/Temperature");

var temperatureController = {};

// Show list of temperature
temperatureController.list = function(req, res) {
    console.log("List Temperature");
    Temperature.find({}).exec(function (err, temperature_list) {
        if (err) {console.log("Error:", err);}
        else {
            let t = temperature_list;
            if(req.body.datetime){t = t.filter(temperature => utils.compareTime(req.body.datetime, temperature["date"]))}
            res.render("../views/temperature", {title: "Temperature", temperature: t, datetime: req.body.datetime});
        }
    });
};

// Save new temperature
temperatureController.save = function(t) {
    console.log("Create Temperature");
    var tempera = new Temperature(t);
    tempera.save(function(err){
        if(err) {
            console.log(err);
        }
        else {
            console.log("Successfully created an Temperature");
        }
    })
};

module.exports = temperatureController;
