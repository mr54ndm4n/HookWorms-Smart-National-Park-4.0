var mongoose = require("mongoose");
var utils = require("../Utils");
var Temperature = require("../models/Temperature");

var temperatureController = {};

// Show list of temperature
temperatureController.list = function(req, res) {
    console.log("List Temperature");
    console.log(start + " : " + stop)
    Temperature.find({}).exec(function (err, temperature_list) {
        if (err) {console.log("Error:", err);}
        else {
            let t = temperature_list;
            if(req.body.datetime_start && req.body.datetime_stop){t = t.filter(temperature => utils.compareTimeLength(temperature["date"], req.body.datetime_start, req.body.datetime_stop))}
            res.render("../views/temperature", {title: "Temperature", temperature: t, datetime_start: req.body.datetime_start, datetime_stop: req.body.datetime_stop});
        }
    });
};

temperatureController.listJson = function(start, stop){
    return new Promise(function(resolve, reject) {
        console.log("List Temperature");
        Temperature.find({}).exec(function (err, temperature_list) {
            if (err) {console.log("Error:", err);}
            else {
                console.log("Not error temp" + start + " :: " + stop);
                let t = temperature_list;
                resolve(t.filter(temperature => utils.compareTimeLength(temperature["date"], start, stop)))
            }
        });
    });
};


// Save new temperature
temperatureController.save = function(t, teamID) {
    // console.log("Create Temperature");
    t["teamID"] = teamID;
    var tempera = new Temperature(t);
    tempera.save(function(err){
        if(err) {
            console.log(err);
        }
        else {
            // console.log("Successfully created an Temperature");
        }
    })
};

module.exports = temperatureController;
