/*
http.201

Demonstrates use of HTTP flow control to slow down responding to an HTTP request.

*/

var http = require("http");
var scheduler = require("scheduler");
var tracing = require("tracing");

http.createServer({
    url: "http://*:8001/foo/bar",
    onNewRequest: function (request) {
        request.onEnd = function (event) {
            request.writeHeaders(200, "OK", { "Content-type": "text/plain" });
        };
        request.onWriteReady = function (event) {
            request.writeBody("To speed up your service, please pay your delinquent bills.", true);
        };
        tracing.write("Received request. Response will be sent in 3000ms.");
        scheduler.later(request.readMore, 3000); // finish reading HTTP request in 3 seconds
    }
}).start();

tracing.write("Listening at http://*:8001/foo/bar");
tracing.write("To test, navigate to http://localhost:8001/foo/bar (or any sub-path) with the browser.");
tracing.write("Press Ctrl-C to terminate server.");