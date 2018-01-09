var rp = require('request-promise');

const url = "http://10.0.0.10/";
let team = 5;
let endpoint_list = [
    {
        name: "temperature",
        endpoint: "api/temperature/"+team+"/3"
    },
    {
        name: "accelerometer",
        endpoint: "api/accelerometer/"+team+"/3"
    },
    {
        name: "din1",
        endpoint: "api/din1/"+team+"/3"
    }];

var myRequests = [];
myRequests.push(rp('https://jsonplaceholder.typicode.com/users'));
myRequests.push(rp('https://github.com'));
Promise.all(myRequests)
    .then((arrayOfHtml) => {
    console.log(arrayOfHtml[0])
    // arrayOfHtml.forEach(function(element) {
    //     console.log(element);
    // });
}).catch(/* handle error */);
