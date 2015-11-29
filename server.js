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

// About the App Page
app.get('/', function(req, res) {
	// Send the user to the about page
	res.render('about');
});

// User Signup Page
app.get('/signup', function(req, res) {
	// res.render('signup', {user: req.user});
	// if user is logged in don't let them see signup view
	if (req.user) {
		console.log(req.user.username + ' tried to sign up.  Redirected to profile.');
		console.log('user', req.user);
		res.redirect('/profile');
	} else {
		res.render('signup', {user: req.user});
	}
});

app.post('/signup', function(req, res) {
	// If user is logged in, don't let them sign up again
	if(req.user) {
		res.redirect('/profile');
		console.log(req.user.username + ' tried to sign up.  Redirected to profile.');
		console.log('user', req.user);
	} else {
		if (req.body.key == "administrator") {
			req.body.key = true;
		} else {
			req.body.key = false;
		}
		User.register(new User({name: req.body.name,
														username: req.body.username,
														admin: req.body.key}),
														req.body.password,
			function(err, newUser) {
				passport.authenticate('local')(req, res, function() {
					console.log(req.user.username + ' signed up. Redirected to profile.');
					res.redirect('/profile');
				});
			}
		);
	}
});

// User login page
app.get('/login', function(req, res) {
	// If user is logged in, don't let them see login view
	if (req.user) {
		if (req.user.admin) {
			console.log(req.user.username + ' tried to log in again.  Redirected to admin.');
			console.log('user', req.user);
			res.redirect('/admin');
		} else {
			console.log(req.user.username + ' tried to log in again.  Redirected to profile.');
			res.redirect('/profile');
		}
	} else {
		res.render('login', {user: req.user});
	}
});

app.post('/login', passport.authenticate('local'), function(req, res) {
	// If admin, send to admin page.  If not, send to user page.
	if (req.user.admin) {
		console.log(req.user.username + ' logged in.  Redirected to admin.');
		console.log('user', req.user);
		res.redirect('/admin');		
	} else {
		console.log(req.user.username + ' logged in.  Redirected to profile.');
		res.redirect('/profile');
	}
});

// User/Admin logout route
app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

// Admin page
app.get('/admin', function(req, res) {
	// Set main admin profile
	if (req.user) {
		if (req.user.admin) {
			res.render('admin', {user: req.user});
			console.log('user', req.user);
		} else {
			res.redirect('/profile');
		}
	} else {
		res.redirect('/login');
	}
});

// Admin page
app.get('/breakdown', function(req, res) {
	// Set main admin profile
	if (req.user) {
		console.log('user', req.user);
		if (req.user.admin) {
			res.render('breakdown', {user: req.user});
		} else {	
			res.redirect('/profile');
		}
	} else {
		res.redirect('/login');
	}
});

// User profile
app.get('/profile', function(req, res) {
	// If user is logged in, direct them to their profile
	if (req.user) {
		console.log('user', req.user);
		res.render('userprofile', {user: req.user});
	} else {
		res.redirect('/login');
	}
});


var currentQuestion;
//
// How do I set the current question?  I want to access the database for one
// question at a time.  I think I can make a global variable for current
// question and have the admin set it from their page.  But I don't know how to
// get that information from mongo.
//
// User questions
app.get('/question', function(req, res) {
	// If user is logged in, let them see the question
	if (req.user) {
		console.log('user', req.user);
		res.render('question', {user: req.user}, {question: currentQuestion});
	} else {
		res.redirect('/login');
	}
});

// Admin display question and breakdown responses
app.get('/breakdown', function(req, res) {
	// If user is admin, let them see the question
	// If user is logged in as a user but not admin, redirect
	// to profile, otherwise, redirect to login
	if (req.user) {
		console.log('user', req.user);
		if (req.user.admin) {
			res.render('breakdown', {user: req.user});
		} else {
			res.redirect('/profile');
		}
	} else {
		res.redirect('/login');
	}
});

// Set up api routes for questions
app.get('/api/questions', function(req, res) {
	Question.find(function(err, allQuestions) {
		if (err) {
			res.json(err);
		} else {
			console.log(allQuestions);
			res.json({questions: allQuestions});
		}
	});
});

app.post('/api/questions', function(req, res) {
	// if (req.user.admin) {
		// Use form data to create new question
		var newQuestion = new Question(req.body);
		newQuestion.save(function(err, savedQuestion) {
			if (err) {
				// console.log('err', err);
				res.json(err);
			} else {
				// console.log('savedQ', savedQuestion);
				res.json(savedQuestion);			
			}
		});
	// } else {
		// res.status(401).json({ error: 'Unauthorized' });
	// }
});

app.get('/api/questions/:id', function(req, res) {
	// Find URL from parameters
	var questionId = req.params.id;
	// Find question in db using id
	Question.findOne({ _id: questionId }, function(err, foundQuestion) {
		if (err) {
			res.json(err);
		} else {
			res.json(foundQuestion);
		}
	});
});

app.delete('/api/questions/:id', function(req, res) {
	// Find the url from the parameters
	var questionId = req.params.id;
	// Find question in the db using the id
	Question.findOneAndRemove({ _id: questionId }, function(err, deletedQuestion) {
		if (err) {
			console.log(err);
		} else {
			res.json(deletedQuestion);
		}
	});
});

app.put('/api/questions/:id', function(req, res) {
	// Find the url from the parameters
	var questionId = req.params.id;
	console.log('qId', questionId);
	// Find question in the db using the id
	Question.findOne({ _id: questionId }, function(err, foundQuestion) {
		if (err) {
			console.log('we have an error.');
			console.log(err);
		} else {
			// Update the question's attributes
			foundQuestion.label = req.body.label;
			foundQuestion.text = req.body.text;
			foundQuestion.answer = req.body.answer;
			foundQuestion.incorrectanswers = req.body.incorrectanswers;
			foundQuestion.userscorrect = req.body.userscorrect;
			foundQuestion.usersincorrect0 = req.body.usersincorrect0;
			foundQuestion.usersincorrect1 = req.body.usersincorrect1;
			foundQuestion.usersincorrect2 = req.body.usersincorrect2;
			// Save updated question
			foundQuestion.save(function(err, savedQuestion) {
				res.json(savedQuestion);
			});
		}
	});
});

// Set up api routes for user
app.get('/api/users', function(req, res) {
	User.find(function(err, allUsers) {
		if (err) {
			res.json(err);
		} else {
			console.log(allUsers);
			res.json({users: allUsers});
		}
	});
});

app.post('/api/users', function(req, res) {
	// if (req.user.admin) {
		// Use form data to create new user
		var newUser = new User(req.body);
		newUser.save(function(err, savedUser) {
			if (err) {
				// console.log('err', err);
				res.json(err);
			} else {
				// console.log('savedQ', savedQuestion);
				res.json(savedUser);			
			}
		});
	// } else {
		// res.status(401).json({ error: 'Unauthorized' });
	// }
});

app.get('/api/users/:id', function(req, res) {
	// Find URL from parameters
	var userId = req.params.id;
	// Find user in db using id
	User.findOne({ _id: userId }, function(err, foundUser) {
		if (err) {
			res.json(err);
		} else {
			res.json(foundUser);
		}
	});
});

app.delete('/api/users/:id', function(req, res) {
	// Find the url from the parameters
	var userId = req.params.id;
	// Find user in the db using the id
	User.findOneAndRemove({ _id: userId }, function(err, deletedUser) {
		if (err) {
			console.log(err);
		} else {
			res.json(deletedUser);
		}
	});
});

//
// I think this will mess up the password field.
// Could we create a second referenced set for the updateable
// fields in users?
//   name, username, avatar, questions, useranswer
//
app.put('/api/users/:id', function(req, res) {
	// Find the url from the parameters
	var userId = req.params.id;
	// Find user in the db using the id
	User.findOne({ _id: userId }, function(err, foundUser) {
		if (err) {
			console.log('we have an error.');
			console.log(err);
		} else {
			// Update the user's attributes
			console.log(req.body);
			foundUser.name = req.body.name;
			foundUser.username = req.body.username;
			foundUser.password = foundUser.password;
			foundUser.avatar = req.body.avatar;
			foundUser.admin = req.body.admin;
			foundUser.questions = req.body.questions;
			foundUser.useranswer = req.body.useranswer;
			console.log('foundUser', foundUser);
			// Save updated user
			foundUser.save(function(err, savedUser) {
				res.json(savedUser);
			});
		}
	});
});

// Start the server
app.listen(process.env.PORT || 5000, function() {
	console.log('server set to:  ON');
});