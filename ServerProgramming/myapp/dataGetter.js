var rp = require('request-promise');
var Promise = require("bluebird");
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/hapi')
    .then(() =>  console.log('connection succesful'))
.catch((err) => console.error(err));

var controllers = [
    require("./controllers/TemperatureController.js"),
    require("./controllers/AccelerometerController.js"),
    require("./controllers/Din1Controller.js")
];

const CATurl = "http://10.0.0.10";
const TEAMS_ID = [19,21,37,11,25,13,31,29,40,24,28,44,46,14,61,30,60,47,49,33,22,10,48,16,38,39,15,18,51,12,50,27,53,52,26,54,43,23,35,34,32];
const AMOUNT = "all";

var myRequests = [];
TEAMS_ID.map(function(team_id){
    myRequests.push(rp(CATurl + "/api/temperature/" + team_id + "/" + AMOUNT));
    myRequests.push(rp(CATurl + "/api/accelerometer/" + team_id + "/" + AMOUNT));
    myRequests.push(rp(CATurl + "/api/din1/" + team_id + "/" + AMOUNT));
});
// console.log("Promise All")
Promise.all(myRequests).then(function(arrayOfHtml){
    for(let i=0; i < arrayOfHtml.length; i+=3){
        let team_id = TEAMS_ID[i/3];
        console.log("Insert Data from TEAM [" + team_id + "]");

        let temperatureData = arrayOfHtml[i]? JSON.parse(arrayOfHtml[i]): null;
        if(temperatureData){
            if(temperatureData.data){
                console.log("\t\tTEAM[" + team_id + "] Temperature (" + temperatureData.data.length + ")");
                temperatureData.data.map(t => controllers[0].save(t, team_id));
            }
        }

        let accelerometerData = arrayOfHtml[i+1]? JSON.parse(arrayOfHtml[i+1]): null;
        if(accelerometerData){
            if(accelerometerData.data){
                console.log("\t\tTEAM[" + team_id + "] Accelerometer (" + accelerometerData.data.length + ")");
                accelerometerData.data.map(a => controllers[1].save(a, team_id));
            }
        }

        let magnetometerData = arrayOfHtml[i+2]? JSON.parse(arrayOfHtml[i+2]): null;
        if(magnetometerData){
            if(magnetometerData.data){
                console.log("\t\tTEAM[" + team_id + "] Magnetometer (" + magnetometerData.data.length + ")");
                magnetometerData.data.map(d => controllers[2].save(d, team_id))
            }
        }

    }
}).catch(function (err) {
    console.log("Error" + err);
});