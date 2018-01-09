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


router.get('/teams/all/', function(req, res, next) {
    var url_temp_5 = "http://10.0.0.10/api/temperature/"+5+"/3";
    var url_acce_5 = "http://10.0.0.10/api/accelerometer/"+5+"/3";
    var url_din1_5 = "http://10.0.0.10/api/din1/"+5+"/3";
    var url_temp_7 = "http://10.0.0.10/api/temperature/"+7+"/3";
    var url_acce_7 = "http://10.0.0.10/api/accelerometer/"+7+"/3";
    var url_din1_7 = "http://10.0.0.10/api/din1/"+7+"/3";
    var url_temp_9 = "http://10.0.0.10/api/temperature/"+9+"/3";
    var url_acce_9 = "http://10.0.0.10/api/accelerometer/"+9+"/3";
    var url_din1_9 = "http://10.0.0.10/api/din1/"+9+"/3";
    request(url_temp_5, function(error, response, body){
        var t_data5 = JSON.parse(body);
        var temp_data5 = t_data5.statusCode == "01"? t_data5.statusDesc : t_data5.data;
        console.log(body)
        request(url_acce_5, function(error, response, body){
            var a_data5= JSON.parse(body);
            var acc_data5 = a_data5.statusCode == "01"? a_data5.statusDesc : a_data5.data;
            request(url_din1_5, function(error, response, body){
                var d_data5 = JSON.parse(body);
                var din1_data5 = d_data5.statusCode == "01"? d_data5.statusDesc : d_data5.data;
                request(url_temp_7, function(error, response, body){
                    var t_data7 = JSON.parse(body);
                    var temp_data7 = t_data7.statusCode == "01"? t_data7.statusDesc : t_data7.data;
                    console.log(body)
                    request(url_acce_7, function(error, response, body){
                        var a_data7= JSON.parse(body);
                        var acc_data7 = a_data7.statusCode == "01"? a_data7.statusDesc : a_data7.data;
                        request(url_din1_7, function(error, response, body){
                            var d_data7 = JSON.parse(body);
                            var din1_data7 = d_data7.statusCode == "01"? d_data7.statusDesc : d_data7.data;
                            request(url_temp_9, function(error, response, body){
                                var t_data9 = JSON.parse(body);
                                var temp_data9 = t_data9.statusCode == "01"? t_data9.statusDesc : t_data9.data;
                                console.log(body)
                                request(url_acce_9, function(error, response, body){
                                    var a_data9= JSON.parse(body);
                                    var acc_data9 = a_data9.statusCode == "01"? a_data9.statusDesc : a_data9.data;
                                    request(url_din1_9, function(error, response, body){
                                        var d_data9 = JSON.parse(body);
                                        var din1_data9 = d_data9.statusCode == "01"? d_data9.statusDesc : d_data9.data;
                                        var result = ({
                                            "teams": [
                                                {
                                                    "id": "5",
                                                    "temparature": temp_data5,
                                                    "accelerometer": acc_data5,
                                                    "din1": din1_data5
                                                },
                                                {
                                                    "id": "7",
                                                    "temparature": temp_data7,
                                                    "accelerometer": acc_data7,
                                                    "din1": din1_data7
                                                },
                                                {
                                                    "id": "9",
                                                    "temparature": temp_data9,
                                                    "accelerometer": acc_data9,
                                                    "din1": din1_data9
                                                }
                                            ]
                                        });
                                        console.log(result);
                                        res.render('teams', {
                                            title: 'All Teams',
                                            result: result
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
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
    // var newuser = req.body;
    // res.send('Add new ' + newuser.name + ' Completed!');
});

module.exports = router;
