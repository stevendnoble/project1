$(function() {

// Selectors for page manipulation
var $avatar = $('.avatar'),
		$box = $('.box'),
		$centerBox = $('.center-box'),
		$centerBox2 = $('.center-box-2'),
		$centerBox3 = $('.center-box-3'),
		$centerBox4 = $('.center-box-4'),
		$navbar = $('.navbar'),
		$scroll = $('.scroll'),
		$window = $(window);

// Selectors for admin tabs
var $addQuestion = $('.add-question'),
		$directionsBtn = $('#directions-btn'),
		$displayQuestionsBtn = $('#display-questions-btn'),
		$viewQuestionsBtn = $('#view-questions-btn'),
		$viewResultsBtn = $('#question-btn'),
		$viewUsersBtn = $('#user-btn');
		
// Selectors for [Directions]
var $directions = $('#directions');

// Selectors for [Add Question]
var $addQuestionBtn = $('#add-question-btn'),
		$previewQuestionBtn = $('#preview-question-btn'),
		$submitQuestionBtn = $('#submit-question-btn'),
		// [Submit]/[Preview]
		$answers0 = $('#answers0'),
		$answers1 = $('#answers1'),
		$answers2 = $('#answers2'),
		$correctanswer = $('#correctanswer'),
		$label = $('#label'),
		$text = $('#text'),
		// [Preview]
		$answerA = $('.answer-a'),
		$answerB = $('.answer-b'),
		$answerC = $('.answer-c'),
		$answerD = $('.answer-d'),
		$formControl = $('.form-control'),
		$question = $('.question');

// Selectors for [View Questions]
var $addQuestionList = $('.add-question-list'),
		$addQuestionListResults = $('#add-question-list-results'),
		$addQuestionListTemplate = $('#add-question-list-template'),
		$addQuestionTabBtn = $('.add-question-tab'),
		$adminProfile = $('#admin-profile'),
		$calculateResults = $('#calculate-results'),
		$calculateResultsToggle = $('.calculate-results-toggle'),
		$breakdown = $('.breakdown'),
		$displayQuestionsPieChart = $('#display-questions-pie-chart'),
		$nextQuestion = $('#next-question'),
		$pieChartCanvas = $('#pie-chart-canvas');

// Selectors for [User Results] and [Question Results]
var $deleteQuestion= $('.delete-question'),
		$deleteUser = $('.delete-user'),
		$questionIndividualResults = $('#question-individual-results'),
		$questionList = $('.question-list'),
		$questionListResults = $('#question-list-results'),
		$questionListTemplate = $('#question-list-template'),
		$questionResultsTemplate = $('#question-results-template'),
		$questionTabBtn = $('.question-tab'),
		$userIndividualResults = $('#user-individual-results'),
		$userList = $('.user-list'),
		$userListResults = $('#user-list-results'),
		$userListTemplate = $('#user-list-template'),
		$userResultsTemplate = $('#user-results-template'),
		$userTabBtn = $('.user-tab');

// URLs for api calls to the database
var baseUrl = '/',
		questionUrl = baseUrl + 'api/questions/',
		userUrl = baseUrl + 'api/users/';

// Handlebars templates and compilers for adding user buttons and
// question buttons to the [View Results] and [View Users] buttons
var addQuestionListSource = $addQuestionListTemplate.html(),
		addQuestionTemplate = Handlebars.compile(addQuestionListSource),
		questionListSource = $questionListTemplate.html(),
		questionTemplate = Handlebars.compile(questionListSource),
		questionResultsSource = $questionResultsTemplate.html(),
		questionResultsTemplate = Handlebars.compile(questionResultsSource),
		userListSource = $userListTemplate.html(),
		userTemplate = Handlebars.compile(userListSource),
		userResultsSource = $userResultsTemplate.html(),
		userResultsTemplate = Handlebars.compile(userResultsSource);

// Global variables
var questionArray = []; // Array for questions to be displayed to students
var index = 0;					// Index of current question
var context;								// Context to be used for displaying charts
var pieChart;						// Current pie chart - needs to be global to destroy it

// Add all questions to the questionArray and filter out questions which are not to be shown
$.get(questionUrl, function(data) {
	questionArray = data.questions ;
	questionArray = questionArray.filter(function(question) {
		return question.show;
	});
});

// Event handlers for page
$avatar.on('click', changeAvatar);
$window.on('resize', calculateHeight);

// Event handlers for admin tabs
$addQuestionBtn.on('click', addQuestionPane);
$directionsBtn.on('click', openDirectionsPane);
$viewQuestionsBtn.on('click', openAddQuestionListPane);
$viewResultsBtn.on('click', openQuestionPane);
$viewUsersBtn.on('click', openUserPane);

// Event handlers for [Add Question]
$previewQuestionBtn.on('click', previewQuestion);
$submitQuestionBtn.on('submit', submitQuestion);

// Event handlers for [View Questions]
$addQuestionListResults.on('click', '.click-to-select', selectQuestion);
$displayQuestionsBtn.on('click', gotoBreakdown);
$nextQuestion.on('click', displayNextQuestion);
$calculateResults.on('click', calculateResults);

// Event handlers for [User Results] and [Question Results]
$userListResults.on('click', '.user-tab', loadUserInfo);
$questionListResults.on('click', '.question-tab', loadQuestionInfo);
$questionIndividualResults.on('click', '.delete', deleteQuestion);
$userIndividualResults.on('click', '.delete', deleteUser);

// Generic functions
calculateHeight();
function calculateHeight() {
	var height = $window.height();
	var width = $window.width();
	var navbarHeight = $navbar.height();
	var boxHeight = $centerBox.height();
	var boxHeight2 = $centerBox2.height();
	var boxHeight3 = $centerBox3.height();
	var boxHeight4 = $centerBox4.height();
	$box.css('height', height - navbarHeight - 36);
	$scroll.css('height', height - 130);
	$centerBox.css('margin-top', ((height - boxHeight - navbarHeight - 36) / 2));	
	$centerBox2.css('margin-top', ((height - boxHeight2 - navbarHeight - 36) / 2));	
	$centerBox3.css('margin-top', ((height - boxHeight3 - navbarHeight - 36) / 2));	
	$centerBox4.css('margin-top', ((height - boxHeight4 - navbarHeight - 36) / 2));	
}

// On click, changes the avatar image and saves to the database
function changeAvatar() {
	// Get the nunber (0-19) from the filename
	var avatarNumber = Number($avatar.attr('src').slice(14).slice(0, -4));
	// Cycle through to the next avatar in the list
	avatarNumber = (avatarNumber + 1) % 20;
	// Create new file name and update this on the webpage
	var avatarFile = 'avatars/avatar' + avatarNumber + '.png';
	$avatar.attr('src', avatarFile);
	// Change avatar in the database
	$.ajax({
		type: 'PATCH',
		url: userUrl + 'self',
		data: {avatar: avatarFile},
	});
}

// Plots the graph of the selected question
function plotGraph(selectedQuestion, boxwidth, pieChartCanvas) {
	// Set canvas to boxwidth
	pieChartCanvas.attr('width', boxwidth);
	pieChartCanvas.attr('height', boxwidth);
	// Get context
	context = pieChartCanvas.get(0).getContext("2d");
	// Create an array for values and labels
	var values = [];
	values.push(selectedQuestion.usersanswers0.length);
	values.push(selectedQuestion.usersanswers1.length);
	values.push(selectedQuestion.usersanswers2.length);
	values.push(selectedQuestion.usersanswers3.length);
	var labels = selectedQuestion.answers;
	// Determine the index of the correct answer, and move that to the first spot
	// to always display the correct answer as green.
	var correctIndex = labels.indexOf(selectedQuestion.correctanswer);
	var correctValue = values.splice(correctIndex, 1);
	values.unshift(correctValue[0]);
	var correctLabel = labels.splice(correctIndex, 1);
	labels.unshift(correctLabel[0]);
	// Add data and options
	var data = [{
    value: values[0],
    color: "#369836",
    highlight: "#8AD48A",
    label: labels[0]
  }, {
    value: values[1],
    color: "#BE7B43",
    highlight: "#FFCFA7",
    label: labels[1]
  }, {
    value: values[2],
    color: "#287272",
    highlight: "#6EA8A8",
    label: labels[2]
  }, {
    value: values[3],
    color: "#BE4343",
    highlight: "#FFA7A7",
    label: labels[3]
  }];
  var options;
	// Create a pie chart using the data
	pieChart = new Chart(context).Pie(data, options);
}

// Plots the graph of the selected question
function plotUserGraph(givendata, boxwidth, pieChartCanvas) {
	// If the container for the canvas is smaller than 200, make the canvas smaller
	if (boxwidth < 200) {
		pieChartCanvas.attr('width', boxwidth);
		pieChartCanvas.attr('height', boxwidth);
	}
	// Get context
	context = pieChartCanvas.get(0).getContext("2d");
	// Add data and options (number of correct/incorrect answers)
	var correct = givendata.correct;
	var incorrect = givendata.questions.length - correct;
	var data = [{
    value: correct,
    color: "#369836",
    highlight: "#8AD48A",
    label: "Correct"
  }, {
    value: incorrect,
    color: "#BE4343",
    highlight: "#FFA7A7",
    label: "Incorrect"
  }];
  var options;
	// Create a pie chart using the data
	var myPieChart = new Chart(context).Pie(data, options);
}

///////////////////////////////
// Function for [Directions] //
///////////////////////////////

// Open the directions pane
function openDirectionsPane() {
	event.preventDefault();
	$directions.show();
	$userList.hide();
	$questionList.hide();
	$addQuestion.hide();
	$displayQuestionsBtn.hide();
	$addQuestionList.hide();
}

//////////////////////////////////
// Functions for [Add Question] //
//////////////////////////////////

// Open the add question pane and the preview question
function addQuestionPane() {
	event.preventDefault();
	$directions.hide();
	$userList.hide();
	$questionList.hide();
	$addQuestion.show();
	$addQuestionList.hide();
	$displayQuestionsBtn.hide();
	calculateHeight();
}

// Add the information from the form to the preview
function previewQuestion() {
	event.preventDefault();
	// Take form data and store it temporarily
	var text = $text.val();
	var correctanswer = $correctanswer.val();
	var answers = [];
	answers[0] = $answers0.val();
	answers[1] = $answers1.val();
	answers[2] = $answers2.val();
	// Add text to the preview Question
	$question.text(text);
	$answerA.text(correctanswer);
	$answerB.text(answers[0]);
	$answerC.text(answers[1]);
	$answerD.text(answers[2]);
	calculateHeight();
}

// Post the question to the server (and then db)
function submitQuestion() {
	event.preventDefault();
	// Take form values and modify them slightly
	var newQuestion = {};
	var correctanswer = $correctanswer.val();
	var answers = [];
	answers[0] = $answers0.val();
	answers[1] = $answers1.val();
	answers[2] = $answers2.val();
	answers.push(correctanswer);
	// Shuffle the answers before storing in the db
	answers = shuffle(answers);
	// Add values to our newQuestion object
	newQuestion.label = $label.val();
	newQuestion.text = $text.val();
	newQuestion.correctanswer = correctanswer;
	newQuestion.answers = answers;
	// Add newQuestion to the db and clear the form
	$.post(questionUrl, newQuestion);
	$formControl.val('');
}

// Shuffle the elements of an array (used for answers)
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

////////////////////////////////////
// Functions for [View Questions] //
////////////////////////////////////

// Open the view questions pane to add questions to the question array
function openAddQuestionListPane() {
	// questionArray = []; // every time this pane is opened it resets the question array
	event.preventDefault();
	$directions.hide();
	$userList.hide();
	$addQuestion.hide();
	$questionList.hide();
	$addQuestionList.show();
	$displayQuestionsBtn.show();
	// Get the questions from the db
	index = 0;
	$.get(questionUrl, function(data) {
		questionResults = data.questions;
		refreshQuestionList(questionResults);
	});
	calculateHeight();
}

// Refresh the question list with the questions from the db
function refreshQuestionList(questionResults) {
	$addQuestionListResults.empty();
	// Render the data
	var addQuestionListHtml = addQuestionTemplate({questions: questionResults});
	$addQuestionListResults.append(addQuestionListHtml);
}

// Adds selected question to the question array to be displayed
function selectQuestion() {
	// Get the id from the button
	var id = $(this).attr('data-id');
	var questionToAdd;
	// Ajax call to get question by id
	$.get(questionUrl + id, function(data) {
		questionToAdd = data;
		// Preview the question to make sure it is the correct one to add to the array
		$question.text(questionToAdd.text);
		$answerA.text(questionToAdd.answers[0]);
		$answerB.text(questionToAdd.answers[1]);
		$answerC.text(questionToAdd.answers[2]);
		$answerD.text(questionToAdd.answers[3]);
		calculateHeight();
	});
	// Change the color of the button and value of show in the database
	if ($(this).hasClass('question-tab')) {
		// Make the button green
		$(this).removeClass('question-tab');
		// Change the value of show to true
		$.ajax({
			type: 'PATCH',
			url: questionUrl + id,
			data: {show: true},
			success: function(data) {
				// Add the question to questionArray (to be displayed)
				questionArray.push(data);
			}
		});
	} else {
		// Make the button yellow
		$(this).addClass('question-tab');
		// Change the value of show to false
		$.ajax({
			type: 'PATCH',
			url: questionUrl + id,
			data: {show: false},
			success: function(data) {
				// Remove the question from questionArray
				for (var i = 0; i < questionArray.length; i++) {
					if (questionArray[i]._id == id) {
						questionArray.splice(i, 1);
					}
				}
			}
		});
	}
}

// Opens the window to display the question and the breakdown of answers
function gotoBreakdown() {
	$adminProfile.hide();
	$breakdown.show();
	$displayQuestionsPieChart.hide();
	$calculateResultsToggle.show();
		if (questionArray.length === 0) {
		$pieChartCanvas.empty();
		$pieChartCanvas.text('You have answered all of the assigned questions. Please return to your profile to review your results.');
		calculateHeight();
	} else {
		$question.text(questionArray[index].text);
		$answerA.text(questionArray[index].answers[0]);
		$answerB.text(questionArray[index].answers[1]);
		$answerC.text(questionArray[index].answers[2]);
		$answerD.text(questionArray[index].answers[3]);
		calculateHeight();
	}
}

// Increments index and displays next question with breakdown
function displayNextQuestion() {
	$nextQuestion.hide();
	$displayQuestionsPieChart.hide();
	pieChart.destroy();
	$calculateResultsToggle.show();
	calculateHeight();
	if(index === questionArray.length-1) {
		$pieChartCanvas.empty();
		$pieChartCanvas.text('You have displayed all of the assigned questions. Please return to your profile to review the results.');
		index = 0;
		calculateHeight();
	} else {
		index++;
		gotoBreakdown();
	}
}

function calculateResults() {
	var boxwidth = $pieChartCanvas.width();
	$displayQuestionsPieChart.show();
	plotGraph(questionArray[index], boxwidth, $displayQuestionsPieChart);
	$calculateResultsToggle.hide();
	$nextQuestion.show();
	calculateHeight();
}

/////////////////////////////////////////////////////////
// Functions for [User Results] and [Question Results] //
/////////////////////////////////////////////////////////

// Open the users pane to view results by user
function openUserPane() {
	event.preventDefault();
	$directions.hide();
	$questionList.hide();
	$addQuestionList.hide();
	$addQuestion.hide();
	$displayQuestionsBtn.hide();
	$userList.show();
	$.get(userUrl, function(data) {
		var userResults = data.users;
		refreshUsers(userResults);
	});
}

// Refreshes the users with results from db
function refreshUsers(userResults) {
	$userListResults.empty();
	// Render the data
	var userListHtml = userTemplate({users: userResults});
	$userListResults.append(userListHtml);
}

// Load the results of individual users
function loadUserInfo() {
	event.preventDefault();
	$userIndividualResults.empty();
	// Get id from button press
	var id = $(this).attr('data-id');
	// Ajax call to get question from db
	$.get(userUrl + id, function(data) {
		var userInfo = data;
		var dataToAppend = {},
				correctCount = 0;
		dataToAppend.userid = id;
		dataToAppend.username = userInfo.username;
		dataToAppend.questions = [];
		for(var i=0; i<userInfo.questions.length; i++) {
			dataToAppend.questions[i] = {};
			dataToAppend.questions[i].question = userInfo.questions[i].label;
			dataToAppend.questions[i].useranswer = userInfo.useranswers[i];
			dataToAppend.questions[i].correctanswer = userInfo.questions[i].correctanswer;
			dataToAppend.questions[i].correct = (dataToAppend.questions[i].useranswer === dataToAppend.questions[i].correctanswer);
			if (dataToAppend.questions[i].correct) correctCount++;
		}
		dataToAppend.correct = correctCount;
		var userResultsHtml = userResultsTemplate(dataToAppend);
		$userIndividualResults.append(userResultsHtml);
		if(pieChart) {
			pieChart.destroy();
		}
		var boxwidth = $userIndividualResults.width();
		var $userResultsPieChart = $('#user-results-pie-chart');
		plotUserGraph(dataToAppend, 200, $userResultsPieChart);
	});
}

// Deletes User from Database
function deleteUser() {
	var id = $(this).attr('data-id');
	$.ajax({
		type: 'DELETE',
		url: userUrl + id,
		success: function(data) {
			openUserPane();
			$userIndividualResults.empty();
		}
	});
}

// Opens the questions pane to view results by question
function openQuestionPane() {
	event.preventDefault();
	$directions.hide();
	$userList.hide();
	$addQuestion.hide();
	$displayQuestionsBtn.hide();
	$addQuestionList.hide();
	$questionList.show();
	$.get(questionUrl, function(data) {
		questionResults = data.questions;
		$questionListResults.empty();
		refreshQuestions(questionResults);
	});
}

// Refreshes the questions with results from db
function refreshQuestions(questionResults) {
	// Render the data
	var questionListHtml = questionTemplate({questions: questionResults});
	$questionListResults.append(questionListHtml);
}

// Load the results of individual questions
function loadQuestionInfo() {
	event.preventDefault();
	$questionIndividualResults.empty();
	// Get id from button press
	var id = $(this).attr('data-id');
	// Ajax call to get question from db
	$.get(questionUrl + id, function(data) {
		var questionInfo = data;
		questionInfo.displayAnswers = [];
		questionInfo.displayAnswers[0] = {answer: questionInfo.answers[0],
																			users: questionInfo.usersanswers0 };
		questionInfo.displayAnswers[1] = {answer: questionInfo.answers[1],
																			users: questionInfo.usersanswers1 };
		questionInfo.displayAnswers[2] = {answer: questionInfo.answers[2],
																			users: questionInfo.usersanswers2 };
		questionInfo.displayAnswers[3] = {answer: questionInfo.answers[3],
																			users: questionInfo.usersanswers3 };	
		// Function will load individual results by question
		var questionResultsHtml = questionResultsTemplate(questionInfo);
		$questionIndividualResults.append(questionResultsHtml);
		if(pieChart) {
			pieChart.destroy();
		}
		$questionResultsPieChart = $('#question-results-pie-chart');
		$questionResultsPieChartCanvas = $('#question-results-pie-chart-canvas');
		var boxwidth = $questionResultsPieChartCanvas.width();
		if (boxwidth > 250) { boxwidth = 250; }
		plotGraph(questionInfo, boxwidth, $questionResultsPieChart);
	});
}

// Deletes User from Database
function deleteQuestion() {
	var id = $(this).attr('data-id');
	$.ajax({
		type: 'DELETE',
		url: questionUrl + id,
		success: function(data) {
			openQuestionPane();
			$questionIndividualResults.empty();
		}
	});
}

});