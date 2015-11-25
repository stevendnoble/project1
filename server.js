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
app.use(cookieParser);
app.use(session({
	secret: 'supersecretkey',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Passport config
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(function(user, done) {
	done(null, user);
});
passport.deserializeUser(function(obj, done) {
	done(null, obj);
});

// Include body parser to handle form inputs
app.use(bodyParser.urlencoded({ extended: true }));

// Set up public folder
app.use(express.static(__dirname + '/public'));

// Set view engine to hbs
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

// Connect to mongodb
mongoose.connect('mongodb://localhost/pulsecheck-app');

//#################
//# SET UP ROUTES #
//#################

// User Signup Page
app.get('/signup', function(req, res) {
	res.render('signup');
});

app.get('/', function(req, res) {
	// Set main admin profile
	res.render('index');
});

app.get('/profile', function(req, res) {
	// Set user profile
	res.render('userprofile');
});

app.get('/question', function(req, res) {
	// Set user profile
	res.render('question');
});

app.get('/login', function(req, res) {
	// Set user profile
	res.render('login');
});

// Set up auth routes


// Set up api routes


// Start the server
app.listen(process.env.PORT || 5000, function() {
	console.log('server set to:  ON');
});