var mongoose = require("mongoose");
var utils = require("../Utils");
var Din1 = require("../models/Din1");

var din1Controller = {};

// Show list of accelerometer
din1Controller.list = function(req, res) {
    console.log("List Din1");
    Din1.find({}).exec(function (err, din1_list) {
        if (err) {console.log("Error:", err);}
        else {
            let t = din1_list;
            if(req.body.datetime_start && req.body.datetime_stop){t = t.filter(din1 => utils.compareTimeLength(din1["date"], req.body.datetime_start, req.body.datetime_stop))}
            res.render("../views/din1", {title: "Din1", din1: t.slice(0, 200), datetime_start: req.body.datetime_start, datetime_stop: req.body.datetime_stop});
        }
    });
};

din1Controller.listJson = function(start, stop){
    return new Promise(function(resolve, reject) {
        console.log("List Din1");
        Din1.find({}).exec(function (err, din1_list) {
            if (err) {console.log("Error:", err);}
            else {
                let t = din1_list;
                resolve(t.filter(din1 => utils.compareTimeLength(din1["date"], start, stop)))
            }
        });
    });
};

// Save new accelerometer
din1Controller.save = function(t, teamID) {
    // console.log("Create Din1");
    t["teamID"] = teamID
    var din1 = new Din1(t);
    din1.save(function(err){
        if(err) {
            console.log(err);
        } else {
            // console.log("Successfully created an DIN1");
        }
    })
};

module.exports = din1Controller;
