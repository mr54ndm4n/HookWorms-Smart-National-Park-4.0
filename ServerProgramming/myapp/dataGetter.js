var express = require('express');
var rp = require('request-promise');
var Promise = require("bluebird");
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/hapi')
    .then(() =>  console.log('connection succesful'))
.catch((err) => console.error(err));

var pressure = require("./controllers/PressureController.js");
var temperature = require("./controllers/TemperatureController.js");
var humidity = require("./controllers/HumidityController.js");
var gyroscope = require("./controllers/GyroscopeController.js");
var accelerometer = require("./controllers/AccelerometerController.js");
var magnetometer = require("./controllers/MagnetometerController.js");

const CATurl = "http://10.0.0.10";
const TEAM_ID = 5;

var myRequests = [];
myRequests.push(rp("http://10.0.0.10/api/pressure/" + TEAM_ID + "/all"));
myRequests.push(rp(CATurl + "/api/temperature/" + TEAM_ID + "/all"));
myRequests.push(rp(CATurl + "/api/humidity/" + TEAM_ID + "/all"));
myRequests.push(rp(CATurl + "/api/gyroscope/" + TEAM_ID + "/all"));
myRequests.push(rp(CATurl + "/api/magnetometer/" + TEAM_ID + "/all"));
myRequests.push(rp(CATurl + "/api/accelerometer/" + TEAM_ID + "/all"));
// console.log("Promise All")
Promise.all(myRequests).then(function(arrayOfHtml){
    let pressure_data = arrayOfHtml[0]? JSON.parse(arrayOfHtml[0]): null;
    if(pressure_data){
        if(!pressure_data.data){
            pressure_data.data = []
        }
        pressure.save(pressure_data)
    }

    let temperature_data = arrayOfHtml[1]? JSON.parse(arrayOfHtml[1]): null;
    if(temperature_data){
        if(!temperature_data.data){
            temperature_data.data = []
        }
        temperature.save(temperature_data)
    }

    let humidity_data = arrayOfHtml[2]? JSON.parse(arrayOfHtml[2]): null;
    if(humidity_data){
        if(!humidity_data.data){
            humidity_data.data = []
        }
        humidity.save(humidity_data)
    }

    let gyroscope_data = arrayOfHtml[3]? JSON.parse(arrayOfHtml[3]): null;
    if(gyroscope_data){
        if(!gyroscope_data.data){
            gyroscope_data.data = []
        }
        gyroscope.save(gyroscope_data)
    }

    let magnetometer_data = arrayOfHtml[4]? JSON.parse(arrayOfHtml[4]): null;
    if(magnetometer_data){
        if(!magnetometer_data.data){
            magnetometer_data.data = []
        }
        magnetometer.save(magnetometer_data)
    }

    let accelerometer_data = arrayOfHtml[5]? JSON.parse(arrayOfHtml[5]): null;
    if(accelerometer_data){
        if(!accelerometer_data.data){
            accelerometer_data.data = []
        }
        accelerometer.save(accelerometer_data)
    }

    // console.log(pressure_data);
    console.log(JSON.stringify({
        pressure_data: pressure_data.data? pressure_data.data.length: "N/A",
        temperature_data: temperature_data.data? temperature_data.data.length: "N/A",
        humidity_data: humidity_data.data? humidity_data.data.length: "N/A",
        gyroscope_data: gyroscope_data.data? gyroscope_data.data.length: "N/A",
        magnetometer_data: magnetometer_data.data? magnetometer_data.data.length: "N/A",
        accelerometer_data: accelerometer_data.data? accelerometer_data.data.length: "N/A"
    }));
}).catch(function (err) {
    console.log("Error" + err);
});
// console.log(temperature.list)
// console.log("Done");