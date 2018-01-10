var rp = require('request-promise');
var Promise = require("bluebird");
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/hapi')
    .then(() =>  console.log('connection succesful'))
.catch((err) => console.error(err));

var controllers = [
    require("./controllers/PressureController.js"),
    require("./controllers/TemperatureController.js"),
    require("./controllers/HumidityController.js"),
    require("./controllers/GyroscopeController.js"),
    require("./controllers/AccelerometerController.js"),
    require("./controllers/MagnetometerController.js")
];

const CATurl = "http://10.0.0.10";
const TEAM_ID = 19;

var myRequests = [];
myRequests.push(rp(CATurl + "/api/pressure/" + TEAM_ID + "/all"));
myRequests.push(rp(CATurl + "/api/temperature/" + TEAM_ID + "/all"));
myRequests.push(rp(CATurl + "/api/humidity/" + TEAM_ID + "/all"));
myRequests.push(rp(CATurl + "/api/gyroscope/" + TEAM_ID + "/all"));
myRequests.push(rp(CATurl + "/api/magnetometer/" + TEAM_ID + "/all"));
myRequests.push(rp(CATurl + "/api/accelerometer/" + TEAM_ID + "/all"));
// console.log("Promise All")
Promise.all(myRequests).then(function(arrayOfHtml){
    for(let i=0; i<6; i++){
        let request_data = arrayOfHtml[i]? JSON.parse(arrayOfHtml[i]): null;
        if(request_data){
            if(request_data.data){
                request_data.data.map(p => controllers[i].save(p))
            }
        }
    }
}).catch(function (err) {
    console.log("Error" + err);
});