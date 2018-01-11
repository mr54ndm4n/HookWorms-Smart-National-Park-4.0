var mongoose = require("mongoose");
var utils = require("../Utils");
var PredictedData = require("../models/PredictedData");


var predictedDataController = {};
// Show list of PredictedData_list
predictedDataController.list = function(req, res) {
    console.log("List PredictedData");
    PredictedData.find({}).exec(function (err, PredictedData_list) {
        if (err) {console.log("Error:", err);}
        else {
            let t = PredictedData_list;
            res.render("../views/predicted", {title: "Predicted Data", predictedData: t});
        }
    });
};


// Save new magnetometer
predictedDataController.save = function(t) {
    console.log("Create PredictedData");
    var predictedData = new PredictedData(t);
    predictedData.save(function(err){
        if(err) {
            console.log(err);
        } else {
            console.log("Successfully created an PredictedData");
        }
    })
};

module.exports = predictedDataController;
