$(function() {

// Selectors for page
var $avatar = $('.avatar'),
		$box = $('.box'),
		$centerBox = $('.center-box'),
		$centerBox2 = $('.center-box-2'),
		$questionBox = $('div#question-box'),
		$directions = $('#directions'),
		$questionListResults = $('.question-list-results'),
		$questionListTemplate = $('#question-list-template'),
		$scroll = $('.scroll'),
		$userid = $('#userid'),
		$username = $('#username'),
		$userProfile = $('#user-profile'),
		$window = $(window);

// Selectors for [View Results]
var $userViewResultsBtn = $('#user-view-results-btn'),
		$userViewResultsList = $('.user-view-results-list'),
		$resultsTemplate = $('#results-template'),
		$questionIndividualResults = $('#question-individual-results'),
		$answeredQuestions = $('#answered-questions');

// Selectors for [Answer Questions]
var $userAnswerQuestionsBtn = $('#user-answer-questions-btn'),
		$userAnswerQuestionsList = $('.user-answer-questions-list'),
		$gotoQuestionsBtn = $('#user-goto-questions-btn'),
		$question = $('.question'),
		$answerA = $('.answer-a'),
		$answerB = $('.answer-b'),
		$answerC = $('.answer-c'),
		$answerD = $('.answer-d'),
		$questionResponse = $('.question-response'),
		$userQuestion = $('#user-question'),
		$userResponse = $('#user-response'),
		$nextQuestion = $('#next-question');

// Global variables
var questionArray = [];
var index = 0;
var username = $username.text();

//##############
//# Handlebars #
//##############
var questionResults = [],
		baseUrl = '/',
		questionUrl = baseUrl + 'api/questions/';
		userUrl = baseUrl + 'api/users/';

var source = $resultsTemplate.html(),
		template = Handlebars.compile(source);

// Event handlers for page
$avatar.on('click', changeAvatar);
$window.on('resize', calculateHeight);

// Event handlers for [View Results]
$userViewResultsBtn.on('click', openQuestionPane);
$answeredQuestions.on('click', '.click-to-select', displayIndividualResults);

// Event handlers for [Answer Questions]
$userAnswerQuestionsBtn.on('click', createQuestionArray);
$nextQuestion.on('click', displayNextQuestion);

// Event handlers for answer buttons
$answerA.on('click', checkAnswer);
$answerB.on('click', checkAnswer);
$answerC.on('click', checkAnswer);
$answerD.on('click', checkAnswer);

// Event handlers for detailed information by user or question
// $userTabBtn.on('click', loadUserInfo);
// $questionTabBtn.on('click', loadQuestionInfo);

// Adjusts the height of boxes on the page
calculateHeight();
function calculateHeight() {
	var height = $window.height();
	var width = $window.width();
	var boxHeight = $centerBox.height();
	var boxHeight2 = $centerBox2.height();
	$box.css('height', height - 90);
	$scroll.css('height', height - 130);
	$centerBox.css('margin-top', ((height - boxHeight - 150) / 2));	
	$centerBox2.css('margin-top', ((height - boxHeight2 - 150) / 2));	
}

// On click, changes the avatar image, but does not yet save to the database
function changeAvatar() {
	var avatarNumber = Number($avatar.attr('src').slice(14).slice(0, -4));
	avatarNumber = (avatarNumber + 1) % 20;
	var avatarFile = 'avatars/avatar' + avatarNumber + '.png';
	$avatar.attr('src', avatarFile);
	// change avatar in the database
}

//////////////////////////////////
// Functions for [View Results] //
//////////////////////////////////

// Opens the pane to [View Results]
// Questions are appended through server-side templating
function openQuestionPane() {
	event.preventDefault();
	$directions.hide();
	$gotoQuestionsBtn.hide();
	$userViewResultsList.show();
	$userAnswerQuestionsList.hide();
}

// When tab is clicked displays results in the results box
function displayIndividualResults() {
	var id = $(this).attr('data-id');
	$questionIndividualResults.empty();
	$.get(questionUrl + id, function(data) {
		var selectedQuestion = data;
		var useranswer;
		if (selectedQuestion.usersanswers0.indexOf(username) !== -1) {
			useranswer = selectedQuestion.answers[0];
		} else if (selectedQuestion.usersanswers1.indexOf(username) !== -1) {
			useranswer = selectedQuestion.answers[1];
		} else if (selectedQuestion.usersanswers2.indexOf(username) !== -1) {
			useranswer = selectedQuestion.answers[2];
		} else if (selectedQuestion.usersanswers3.indexOf(username) !== -1) {
			useranswer = selectedQuestion.answers[3];
		}
		var message;
		if (useranswer === selectedQuestion.correctanswer) {
			message = 'Excellent Job!  You were correct.';
		} else {
			message = 'Nice try. Better luck next time!';
		}
		var dataToAppend = {
			label: selectedQuestion.label,
			question: selectedQuestion.text,
			answers: selectedQuestion.answers,
			useranswer: useranswer,
			correctanswer: selectedQuestion.correctanswer,
			message: message
		};
		var htmlResults = template(dataToAppend);
		$questionIndividualResults.append(htmlResults);
		plotGraph(selectedQuestion);
	});
}

function plotGraph(selectedQuestion) {
	// 1. add canvas
	// 2. add var $breakdownPieChart = $('#breakdown-pie-chart');
	//    edit boxwidth = $ to measure the correct box width
	// 3. add code below

	var $breakdownPieChart = $('#breakdown-pie-chart');

	// If canvas is bigger than the box-width, make the canvas smaller
	var boxwidth = $questionIndividualResults.width();
	if (boxwidth < 400) {
		$breakdownPieChart.attr('width', width);
		$breakdownPieChart.attr('height', width);
	}

	// Get context with jQuery - using jQuery's .get() method.
	var ctx = $breakdownPieChart.get(0).getContext("2d");
	// Create an array for values and labels
	var values = [];
	values.push(selectedQuestion.usersanswers0.length);
	values.push(selectedQuestion.usersanswers1.length);
	values.push(selectedQuestion.usersanswers2.length);
	values.push(selectedQuestion.usersanswers3.length);
	console.log('unadjusted values', values);
	var labels = selectedQuestion.answers;
	console.log('unadjusted labels', labels);
	// Determine the index of the correct answer, and move that to the first spot
	// to always display the correct answer as green.
	console.log(selectedQuestion);
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
	var myPieChart = new Chart(ctx).Pie(data, options);
}

//////////////////////////////////////
// Functions for [Answer Questions] //
//////////////////////////////////////

// Add all questions to the questionArray and filter out questions which are not to be shown
// Runs displayQuestions within the callback function
function createQuestionArray() {
	// Create an array of all questions
	console.log('createQA before index reset: index =', index);
	index = 0;

	$.get(questionUrl, function(data) {
		questionArray = data.questions;
		// Filter out only the questions that the user has answered and that the admin has not selected
		questionArray = questionArray.filter(function(question) {
			if (!question.show) {
				return false;
			} else if (question.usersanswers0.indexOf(username) !== -1) {
				return false;
			} else if (question.usersanswers1.indexOf(username) !== -1) {
				return false;
			} else if (question.usersanswers2.indexOf(username) !== -1) {
				return false;
			} else if (question.usersanswers3.indexOf(username) !== -1) {
				return false;
			} else {
				return true;
			}
		});
		if (questionArray.length === 0) {
			$questionResponse.text('You have answered all of the assigned questions. Please return to your profile to review your results.');
			$nextQuestion.hide();
			$userResponse.show();
			$userProfile.hide();
			calculateHeight();
		} else {
			displayQuestions();
		}
	});	
}

// Displays the question on the PulseCheck app for users
function displayQuestions() {
	console.log('index', index);
	$userResponse.hide();
	$userProfile.hide();
	$userQuestion.show();
	$nextQuestion.show();
	calculateHeight();
	$question.text(questionArray[index].text);
	$answerA.text(questionArray[index].answers[0]);
	$answerB.text(questionArray[index].answers[1]);
	$answerC.text(questionArray[index].answers[2]);
	$answerD.text(questionArray[index].answers[3]);
}

// Increments index and opens next question
function displayNextQuestion() {
	console.log('index', index);
	if(index === questionArray.length-1) {
		$questionResponse.text('You have answered all of the assigned questions. Please return to your profile to review your results.');
		index = 0;
		$nextQuestion.hide();
		calculateHeight();
	} else {
		index++;
		displayQuestions();
	}
}

// When user clicks an answer, checks to see if it is correct
// Submit answer to the server. Provide a response to the user.
// Gives a link to the next question.
function checkAnswer() {
	var answerIndex = Number($(this).attr('id'));
	var questionId = questionArray[index]._id;
	var username = $username.text();
	var userid = $userid.text();
	if(questionArray[index].correctanswer === questionArray[index].answers[answerIndex]) {
		$questionResponse.text('Correct!');
	} else {
		$questionResponse.text('Sorry. That answer is incorrect');
	}
	$userQuestion.hide();
	$userResponse.show();
	calculateHeight();
	$.ajax({
		type: 'PATCH',
		url: questionUrl + questionId + '/answers',
		data: {
						userId: userid,
						username: username,
						useranswerIndex: answerIndex,
						useranswer: questionArray[index].answers[answerIndex]
					},
		success: function(data) {
			console.log('updated database');
			questionArray.push(data);
		}
	});
}

});