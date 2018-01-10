var mongoose = require("mongoose");
var Temperature = require("../models/Temperature");

var temperatureController = {};

// Show list of temperature
temperatureController.list = function(req, res) {
    console.log("List Temperature")
    var compareTime = (input_d, d) => {
        input_d.setMinutes(input_d.getMinutes() - 30)
        return (d - input_d) > 0 && (d - input_d) <= 1800000
    }
    Temperature.find({}).exec(function (err, temperature) {
        if (err) {
            console.log("Error:", err);
        }
        else {
            if(req.body.datetime){
                console.log("With filter");
                t = []
                for(var i=0; i<temperature[0].data.length; i++){
                    if(compareTime(new Date(req.body.datetime), new Date(temperature[0].data[i]["date"]))){
                        t.push(temperature[0].data[i]);
                    }
                }
            }
            else{
                console.log("Non Filter");
                t = temperature[0].data
                console.log("t");
                console.log(t);
            }
            // console.log(temperature[0].data);
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
        } else {
            console.log("Successfully created an Pressure with " + t.data.length + " datas");
        }
    })
};

module.exports = temperatureController;
