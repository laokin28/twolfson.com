// Auto-respawn appsetTimeout( function () {  // var cp = require('child_process');  // cp.fork('./app.js');  // process.exit(0);}, 5000 );// }, 24 * 60 * 60 * 1000 );var express = require('express'),		app = express.createServer(),		ejs = require('ejs');app.use('/public', express.static(__dirname + '/public'));app.set('view engine', 'ejs');app.error(function (err, req, res, next) {	if(err instanceof NotFound) {		res.render('404.ejs');	} else {		next(err);	}});app.get('/', function (req, res) {	res.render('resume.ejs', {'page': 'resume'});});app.get('*', function(req, res){	throw new NotFound;});function NotFound(msg){    this.name = 'NotFound';    Error.call(this, msg);    Error.captureStackTrace(this, arguments.callee);}app.listen(8080);// console.log("Server running at http://127.0.0.1:8080/");