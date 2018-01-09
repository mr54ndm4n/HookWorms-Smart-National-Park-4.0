var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var request = require('request');
var https = require('https');
var rp = require('request-promise');

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
    var result = Promise.all(myRequests)
        .then((arrayOfHtml) => {
        var temparature = arrayOfHtml[0]? JSON.parse(arrayOfHtml[0]).data: null;
        var accelerometer = arrayOfHtml[1]? JSON.parse(arrayOfHtml[1]).data: null;
        var din1 = arrayOfHtml[2]? JSON.parse(arrayOfHtml[2]).data: null;
        return ({
            "id": team,
            "temparature": 1,
            "accelerometer": 2,
            "din1": 3
        });
    }).catch(function (err) {
        console.log("Error" + err);
    });
    console.log("Result");
    console.log(result)
    res.render('team', {
        title: 'Team ' + team,
        result: result
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
    var data_list = []
    device_nodes.forEach((device_node) => {
        data_list.push(dataFetcher(device_node, res));
    })
    console.log(data_list);
    res.render('teams', {
        title: 'All Teams',
        result: data_list
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
