// SERVER SIDE JAVASCRIPT

// Require express and other dependencies
var express = require('express'),
		app = express(),
		bodyParser = require('body-parser'),
		hbs = require('hbs'),
		mongoose = require('mongoose'),
		cookieParser = require('cookie-parser'),
		session = require('express-session'),
		passport = require('passport'),
		LocalStrategy = require('passport-local').Strategy;
		// var oauth = require('./oauth.js');

// Require models
var User = require('./models/user'),
		Question = require('./models/question');

// Middleware for auth


// Passport config


// Include body parser to handle form inputs


// Set up public folder
app.use(express.static(__dirname + '/public'));

// Set view engine to hbs
app.set('view engine', 'hbs');

// Connect to mongodb


// Set up routes
app.get('/', function(req, res) {
	res.render('index');
});

// Set up auth routes


// Set up api routes


// Start the server
app.listen(process.env.PORT || 5000, function() {
	console.log('server set to:  ON');
});