var mongoose = require("mongoose");
var utils = require("../Utils");
var Humidity = require("../models/Humidity");

var humidityController = {};


// Show list of humidity
humidityController.list = function(req, res) {
    console.log("List Humidity");
    Humidity.find({}).exec(function (err, humidity_list) {
        if (err) {console.log("Error:", err);}
        else {
            let t = humidity_list;
            if(req.body.datetime){t = t.filter(humidity => utils.compareTime(req.body.datetime, humidity["date"]))}
            res.render("../views/humidity", {title: "Humidity", humidity: t, datetime: req.body.datetime});
        }
    });
};


// Save new humidity
humidityController.save = function(t) {
    console.log("Create Humidity");
    var humidity = new Humidity(t);
    humidity.save(function(err){
        if(err) {
            console.log(err);
        } else {
            console.log("Successfully created an Humidity");
        }
    })
};

module.exports = humidityController;
