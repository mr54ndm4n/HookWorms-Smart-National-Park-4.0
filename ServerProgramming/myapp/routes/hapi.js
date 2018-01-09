var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var request = require('request');
var https = require('https');
var rp = require('request-promise');
var Promise = require("bluebird");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));

const CATurl = "http://10.0.0.10";
const status = {
    "00": {
        code: "00",
        desc: "Success"
    },
    "01": {
        code: "01",
        desc: "Cannot find the given TeamID"
    },
    "02": {
        code: "02",
        desc: "Cannot find the requested data"
    }
};


var dataFetcher = (team, res) => {

    var myRequests = [];
    myRequests.push(rp(CATurl + "/api/temperature/" + team + "/3"));
    myRequests.push(rp(CATurl + "/api/accelerometer/" + team + "/3"));
    myRequests.push(rp(CATurl + "/api/din1/"+team+"/3"));
    Promise.all(myRequests).then(function(arrayOfHtml){
        let temparature_data = arrayOfHtml[0]? JSON.parse(arrayOfHtml[0]).data: null;
        let accelerometer_data = arrayOfHtml[1]? JSON.parse(arrayOfHtml[1]).data: null;
        let din1_data = arrayOfHtml[2]? JSON.parse(arrayOfHtml[2]).data: null;
        let result = ({
            "id": team,
            "temparature": temparature_data,
            "accelerometer": accelerometer_data,
            "din1": din1_data
        });
        res.render('team', {
            title: 'Team ' + team,
            result: result
        });
    }).catch(function (err) {
        console.log("Error" + err);
    });
}

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('hapi_home', { title: 'Express'});
});

router.get('/hookworms', function(req, res, next) {
    res.render('hapi_home', { title: 'hookworms' });
});


router.get('/teams/all/', function(req, res, next) {
    var data_list = [];
    var myRequests = [];
    var nodes_list = [5, 7, 9];
    nodes_list.forEach(function(device_node){
        myRequests.push(rp(CATurl + "/api/temperature/" + device_node + "/3"));
        myRequests.push(rp(CATurl + "/api/accelerometer/" + device_node + "/3"));
        myRequests.push(rp(CATurl + "/api/din1/"+device_node+"/3"));
    });
    Promise.all(myRequests).then(function (arrayOfData){
        console.log("myRequests.length = " + myRequests.length);
        var result_data_list = [];
        for(let i = 0; i<myRequests.length; i += 3){
            console.log("TEAM {" + nodes_list[(i)/3] + "}");
            let temparature_data = arrayOfData[i]? JSON.parse(arrayOfData[i]).data: null;
            let accelerometer_data = arrayOfData[i+1]? JSON.parse(arrayOfData[i+1]).data: null;
            let din1_data = arrayOfData[i+2]? JSON.parse(arrayOfData[i+2]).data: null;
            result_data_list.push({
                "id": nodes_list[(i)/3],
                "temparature": temparature_data,
                "accelerometer": accelerometer_data,
                "din1": din1_data
            })
        }
        console.log("result_data_list");
        console.log(result_data_list);
    });
    res.render('index', {
        title: 'All Teams',
        result: []
    });
});

router.get('/teams/:teamID/', function(req, res, next) {
    dataFetcher(req.params.teamID, res);
});

router.get('/showresponse', function(req, res, next) {
    res.locals.TEAM_ID = null;
    res.locals.LAT = null;
    res.locals.LONG = null;
    res.render('showresponse1', {title: "Show POST Response"});
});

router.post('/showresponse', function(req, res, next) {
    res.render('showresponse2', {
        title: "Show POST Response",
        TEAM_ID: req.body.TEAM_ID,
        LAT: req.body.LAT,
        LONG: req.body.LONG
    });
});

module.exports = router;
