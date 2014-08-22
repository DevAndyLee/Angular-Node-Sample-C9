//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');

var async = require('async');
var express = require('express');
var routes = require('./back_end/routes');

//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = express();
var server = http.createServer(router);

// Host the ajax api
router.use("/api", routes.router);

// Host the client site (change to 'angular/dist' for optimised version)
router.use(express.static(path.resolve(__dirname, 'angular/app')));

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0");
