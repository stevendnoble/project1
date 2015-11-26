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
app.use(cookieParser());
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
	// res.render('signup', {user: req.user});
	// if user is logged in don't let them see signup view
	if (req.user) {
		res.redirect('/profile');
	} else {
		res.render('signup', {user: req.user});
	}
});

app.post('/signup', function(req, res) {
	// If user is logged in, don't let them sign up again
	if(req.user) {
		res.redirect('/profile');
	} else {
		User.register(new User({username: req.body.username}), req.body.password,
			function(err, newUser) {
				passport.authenticate('local')(req, res, function() {
					//res.send('signed up');
					res.redirect('/profile');
				});
			}
		);
	}
});

// User login page
app.get('/login', function(req, res) {
	// If user is logged in, don't let them see login view
	if (req.user.admin) {
		res.redirect('/admin');
	} else if (req.user) {
		res.redirect('/profile');
	} else {
		res.render('login', {user: req.user});
	}
});

app.post('/login', passport.authenticate('local'), function(req, res) {
	// res.send('logged in');
	res.redirect('/profile');
});

// User/Admin logout route
app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/login');
});

// Admin page
app.get('/admin', function(req, res) {
	// Set main admin profile
	// if (req.user.admin) {
		res.render('admin', {user: req.user});
	// } else if (req.user) {
	// 	res.redirect('/profile');
	// } else {
	// 	res.redirect('/login');
	// }
});

// User profile
app.get('/profile', function(req, res) {
	// If user is logged in, direct them to their profile
	if (req.user) {
		res.render('userprofile', {user: req.user});
	} else {
		res.redirect('/login');
	}
});

// User questions
app.get('/question', function(req, res) {
	// If user is logged in, let them see the question
	if (req.user) {
		res.render('question', {user: req.user});
	} else {
		res.redirect('/login');
	}
});

// Admin display question and breakdown responses
app.get('/breakdown', function(req, res) {
	// If user is admin, let them see the question
	// If user is logged in as a user but not admin, redirect
	// to profile, otherwise, redirect to login
	if (req.user.admin) {
		res.render('breakdown', {user: req.user});
	} else if (req.user) {
		res.redirect('/profile');
	} else {
		res.redirect('/login');
	}
});

// Set up api routes


// Start the server
app.listen(process.env.PORT || 5000, function() {
	console.log('server set to:  ON');
});