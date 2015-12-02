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
		$userViewResultsList = $('.user-view-results-list');

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

//##############
//# Handlebars #
//##############
var questionResults = [],
		baseUrl = '/',
		questionUrl = baseUrl + 'api/questions';
		userUrl = baseUrl + 'api/users';

var questionListSource = $questionListTemplate.html(),
		questionTemplate = Handlebars.compile(questionListSource);

// Event handlers for page
$avatar.on('click', changeAvatar);
$window.on('resize', calculateHeight);

// Event handlers for [View Results]
$userViewResultsBtn.on('click', openQuestionPane);
// $viewQuestionsBtn.on('click', openAddQuestionListPane);

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
// Questions are taken from the completed questions in the user's profile
function openQuestionPane() {
	event.preventDefault();
	$directions.hide();
	$gotoQuestionsBtn.hide();
	$userViewResultsList.show();
	$userAnswerQuestionsList.hide();
	// This is all questions... we want to use server-side to append answered ones
	// $.get(questionUrl, function(data) {
	// 	questionResults = data.questions;
	// 	refreshQuestions(questionResults);
	// });
}

//////////////////////////////////////
// Functions for [Answer Questions] //
//////////////////////////////////////

// Add all questions to the questionArray and filter out questions which are not to be shown
// Runs displayQuestions within the callback function
function createQuestionArray() {
	$.get(questionUrl, function(data) {
		questionArray = data.questions ;
		questionArray = questionArray.filter(function(question) {
			return question.show;
		});
		displayQuestion();
	});	
}

function displayQuestion() {
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

function displayNextQuestion() {
	if(index === questionArray.length-1) {
		$questionResponse.text('You have answered the last question. Please return to your profile to review your results.');
		$nextQuestion.hide();
		calculateHeight();
	} else {
		index++;
		displayQuestion();
	}
}

// When user clicks an answer, checks to see if it is correct
// Submit answer to the server. Provide a response to the user.
//Gives a link to the next question.
function checkAnswer() {
	var answerIndex = Number($(this).attr('id'));
	var questionId = questionArray[index]._id;
	var username = $username.text();
	var userid = $userid.text();
	console.log('answerIndex', answerIndex, 'questionId', questionId);
	console.log('username', username, 'userid', userid);
	if(questionArray[index].correctanswer === questionArray[index].answers[answerIndex]) {
		$questionResponse.text('Correct!');
	} else {
		$questionResponse.text('Sorry :(  You are incorrect');
	}
	$userQuestion.hide();
	$userResponse.show();
	calculateHeight();

	$.ajax({
		type: 'PATCH',
		url: questionUrl + '/' + questionId + '/answers',
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