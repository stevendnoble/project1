// SERVER SIDE JAVASCRIPT

// Require express and other dependencies
var express = require('express'),
		app = express(),
		bodyParser = require('body-parser'),
		hbs = require('hbs'),
		mongoose = require('mongoose'),
		cookieParser = require('cookie-parser'),
		session = require('express-session'),
		flash = require('express-flash'),
		passport = require('passport'),
		LocalStrategy = require('passport-local').Strategy;

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

// Send flash messages
app.use(flash());

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
mongoose.connect(
	process.env.MONGOLAB_URI ||
	process.env.MONGOHQ_URL ||
	'mongodb://localhost/pulsecheck-app'
);

//#################
//# SET UP ROUTES #
//#################

// About the App Page
app.get('/', function(req, res) {
	// Send the user to the about page
	res.render('about', {user: req.user});
});

// User Signup Page
app.get('/signup', function(req, res) {
	// res.render('signup', {user: req.user});
	// if user is logged in don't let them see signup view
	if (req.user) {
		console.log(req.user.username + ' tried to sign up.  Redirected to profile.');		
		res.redirect('/profile');
	} else {
		res.render('signup', {user: req.user, errorMessage: req.flash('signupError')});
	}
});

app.post('/signup', function(req, res) {
	// If user is logged in, don't let them sign up again
	if(req.user) {
		res.redirect('/profile');
		console.log(req.user.username + ' tried to sign up.  Redirected to profile.');
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
				if (err) {
					// Set flash message
					req.flash('signupError', err.message);
					res.redirect('/signup');
				} else {
					passport.authenticate('local')(req, res, function() {
						console.log(req.user.username + ' signed up. Redirected to profile.');
						if(req.user.admin) {
							res.redirect('/admin');
						} else {
							res.redirect('/profile');
						}
					});					
				}
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
		User.findOne({_id: req.user._id})
		.populate('questions')
		.exec(function(err, foundUser) {
			res.render('userprofile', {user: foundUser});
		});
	} else {
		res.redirect('/login');
	}
});

// Set up api routes for questions
app.get('/api/questions', function(req, res) {
	Question.find(function(err, allQuestions) {
		if (err) {
			console.log('GET Question Error: ', err);
			res.json(err);
		} else {
			res.json({questions: allQuestions});
		}
	});
});

app.post('/api/questions', function(req, res) {
	if (req.user.admin) {
		// Use form data to create new question
		var newQuestion = new Question(req.body);
		newQuestion.save(function(err, savedQuestion) {
			if (err) {
				console.log('POST Question Error: ', err);
				res.json(err);
			} else {
				console.log('Saved Question');
				res.json(savedQuestion);			
			}
		});
	} else {
		res.status(401).json({ error: 'Unauthorized' });
	}
});

app.get('/api/questions/:id', function(req, res) {
	// Find URL from parameters
	var questionId = req.params.id;
	// Find question in db using id
	Question.findOne({ _id: questionId }, function(err, foundQuestion) {
		if (err) {
			console.log('GET Question Error: ', err);
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
			console.log('DELETE Question Error: ', err);
			res.json(err);
		} else {
			res.json(deletedQuestion);
		}
	});
});

app.patch('/api/questions/:id', function(req, res) {
	// Find the url from the parameters
	var questionId = req.params.id;
	// Find question in the db using the id
	Question.findOne({ _id: questionId }, function(err, foundQuestion) {
		if (err) {
			console.log('PUT Question Error: ', err);
		} else {
			// Update the question's attributes
			foundQuestion.label = req.body.label || foundQuestion.label;
			foundQuestion.text = req.body.text || foundQuestion.text;
			foundQuestion.correctanswer = req.body.correctanswer || foundQuestion.correctanswer;
			foundQuestion.answers = req.body.answers || foundQuestion.answers;
			foundQuestion.show = req.body.show || foundQuestion.show;
			foundQuestion.usersanswers0 = req.body.usersanswers0 || foundQuestion.usersanswers0;
			foundQuestion.usersanswers1 = req.body.usersanswers1 || foundQuestion.usersanswers1;
			foundQuestion.usersanswers2 = req.body.usersanswers2 || foundQuestion.usersanswers2;
			foundQuestion.usersanswers3 = req.body.usersanswers3 || foundQuestion.usersanswers3;
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
			console.log('GET User Error: ', err);
			res.json(err);
		} else {
			console.log(allUsers);
			res.json({users: allUsers});
		}
	});
});

app.post('/api/users', function(req, res) {
	// Use form data to create new user
	var newUser = new User(req.body);
	newUser.save(function(err, savedUser) {
		if (err) {
			console.log('POST User Error: ', err);
			res.json(err);
		} else {
			res.json(savedUser);			
		}
	});
});

app.get('/api/users/:id', function(req, res) {
	// Find URL from parameters
	var userId = req.params.id;
	// Find user in db using id
	User.findOne({ _id: userId })
	.populate('questions')
	.exec(function(err, foundUser) {
		if (err) {
			console.log('GET User Error: ', err);
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
			console.log('DELETE User Error: ', err);
			res.json(err);
		} else {
			res.json(deletedUser);
		}
	});
});

app.patch('/api/users/:id', function(req, res) {
	// Find the url from the parameters
	var userId;
	var id = req.params.id;
	if (userId === 'self') {
		userId = req.user._id;
	} else if (req.user.admin) {
		userId = id;
	} else {
		res.status(403).json({errorMessage: 'Unauthorized access'});
	}
	// Find user in the db using the id
	User.findOne({ _id: userId }, function(err, foundUser) {
		if (err) {
			console.log('PATCH User Error: ', err);
			res.json(err);
		} else {
			// Update the user's attributes
			console.log('PATCH req.body', req.body);
			foundUser.name = req.body.name || foundUser.name;
			foundUser.username = req.body.username || foundUser.username;
			foundUser.password = req.body.password || foundUser.password;
			foundUser.avatar = req.body.avatar || foundUser.avatar;
			foundUser.admin = req.body.admin || foundUser.admin;
			foundUser.questions = req.body.questions || foundUser.questions;
			foundUser.useranswers = req.body.useranswers || foundUser.useranswers;
			console.log('PATCH foundUser (after)', foundUser);
			// Save updated user
			foundUser.save(function(err, savedUser) {
				res.json(savedUser);
			});
		}
	});
});

app.patch('/api/questions/:questionId/answers', function(req, res) {
	// In req, takes in userId, username, useranswerIndex, and useranswer
	var questionId = req.params.questionId;
	var useranswerIndex = req.body.useranswerIndex; // number 0, 1, 2, or 3
	var useranswer = req.body.useranswer;
	User.findOne({ _id: req.user._id }, function(err, foundUser) {
		foundUser.questions.push(questionId);
		foundUser.useranswers.push(useranswer);
		foundUser.save();
	});
	Question.findOne({ _id: questionId }, function(err, foundQuestion) {
		if (useranswerIndex === '0') {
			foundQuestion.usersanswers0.push(req.user.username);
		} else if (useranswerIndex === '1') {
			foundQuestion.usersanswers1.push(req.user.username);
		} else if (useranswerIndex === '2') {
			foundQuestion.usersanswers2.push(req.user.username);
		} else if (useranswerIndex === '3') {
			foundQuestion.usersanswers3.push(req.user.username);
		}	else {
			console.log('POST Answer Error');
		}
		foundQuestion.save();
	});
});

// Start the server
app.listen(process.env.PORT || 5000, function() {
	console.log('server set to:  ON');
});