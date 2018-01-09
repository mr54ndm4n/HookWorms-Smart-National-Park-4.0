var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var request = require('request');
var https = require('https');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));

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


const catEndPoint = "cat.com";
const teams = [5];

var dataFetcher = (team, res) => {
    var url_temp = "http://10.0.0.10/api/temperature/"+team+"/3";
    var url_acce = "http://10.0.0.10/api/accelerometer/"+team+"/3";
    var url_din1 = "http://10.0.0.10/api/din1/"+team+"/3";
    request(url_temp, function(error, response, body){
        var t_data = JSON.parse(body);
        var temp_data = t_data.statusCode == "01"? t_data.statusDesc : t_data.data;
        console.log(body)
        // try{var temp_data = JSON.parse(body).data; console.log(JSON.parse(body).data);}
        // catch(e){var temp_data = "Can't get data"; console.log("Can't get temp");}
        request(url_acce, function(error, response, body){
            var a_data = JSON.parse(body);
            var acc_data = a_data.statusCode == "01"? a_data.statusDesc : a_data.data;
            // try{var acc_data = JSON.parse(body).data; console.log(JSON.parse(body).data);}
            // catch(e){var acc_data = "Can't get data"; console.log("Can't get accelerometer");}
            request(url_din1, function(error, response, body){
                var d_data = JSON.parse(body);
                var din1_data = d_data.statusCode == "01"? d_data.statusDesc : d_data.data;
                // try{var din1_data = JSON.parse(body).data; console.log(JSON.parse(body).data);}
                // catch(e){var din1_data = "Can't get data"; console.log("Can't get din1");}
                var result = ({
                    "id": team,
                    "temparature": temp_data,
                    "accelerometer": acc_data,
                    "din1": din1_data
                });
                console.log(result);
                res.render('team', {
                    title: 'Team ' + team,
                    result: result
                });
            });
        });
    });
}

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('hapi_home', { title: 'Express'});
});

router.get('/hookworms', function(req, res, next) {
    res.render('hapi_home', { title: 'hookworms' });
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
    // var newuser = req.body;
    // res.send('Add new ' + newuser.name + ' Completed!');
});

module.exports = router;
