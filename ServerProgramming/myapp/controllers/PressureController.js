var mongoose = require("mongoose");
var Pressure = require("../models/Pressure");

var pressureController = {};

// Show list of pressure
pressureController.list = function(req, res) {
    console.log("List Pressure");
    Pressure.find({}).exec(function (err, pressure) {
        if (err) {
            console.log("Error:", err);
        }
        else {
            console.log(pressure[0].data);
            res.render("../views/pressure", {title: "Pressure", pressure: pressure[0].data});
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
            console.log("Successfully created an Pressure with " + t.data.length + " datas");
        }
    })
};

module.exports = pressureController;
