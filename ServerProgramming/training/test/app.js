console.log("Hello, World");

var http = require("http");

http.createServer(function (request, response) {
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("Hello My World");
    response.end()
}).listen(8080);

console.log("Server is running at localhost:8080")