var mongoose = require("mongoose");
var Humidity = require("../models/Humidity");

var humidityController = {};


// Show list of humidity
humidityController.list = function(req, res) {
    console.log("List Humidity");
    Humidity.find({}).exec(function (err, humidity) {
        if (err) {
            console.log("Error:", err);
        }
        else {
            console.log(humidity[0].data);
            res.render("../views/humidity", {title: "Humidity", humidity: humidity[0].data});
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
            console.log("Successfully created an Humidity with " + t.data.length + " datas");
        }
    })
};

module.exports = humidityController;
