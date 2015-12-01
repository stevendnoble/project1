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
		$userProfile = $('#user-profile'),
		$userQuestionBox = $('#user-question-box'),
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
		$answerD = $('.answer-d');

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
$gotoQuestionsBtn.on('click', gotoQuestions);
$userAnswerQuestionsBtn.on('click', openUserAnswerQuestionListPane);
$questionListResults.on('click', '.click-to-select', addToQuestionArray);
// $displayQuestionsBtn.on('click', gotoBreakdown);

// Event handlers for answer buttons
$answerA.on('click', checkAnswer);
$answerB.on('click', checkAnswer);
$answerC.on('click', checkAnswer);
$answerD.on('click', checkAnswer);

// Event handlers for detailed information by user or question
// $userTabBtn.on('click', loadUserInfo);
// $questionTabBtn.on('click', loadQuestionInfo);

// Needs to be part of both
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

function changeAvatar() {
	var avatarNumber = Number($avatar.attr('src').slice(14).slice(0, -4));
	avatarNumber = (avatarNumber + 1) % 20;
	var avatarFile = 'avatars/avatar' + avatarNumber + '.png';
	$avatar.attr('src', avatarFile);
	// change avatar in the database
}

// Functions for [View Results]
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

// Functions for [Answer Questions]
function openUserAnswerQuestionListPane() {
	questionArray = []; // every time this pane is opened it resets the question array
	event.preventDefault();
	$gotoQuestionsBtn.show();
	$directions.hide();
	$userViewResultsList.hide();
	$userAnswerQuestionsList.show();
	$.get(questionUrl, function(data) {
		questionResults = data.questions;
		$questionListResults.empty();
		refreshQuestionList(questionResults);
	});
	calculateHeight();
}

function refreshQuestionList(questionResults) {
	console.log('refreshing questions');
	console.log(questionResults);
	// Render the data
	var questionListHtml = questionTemplate({questions: questionResults});
	$questionListResults.append(questionListHtml);
}

function addToQuestionArray() {
	// Get the id from the button
	var id = $(this).attr('data-id');
	var questionToAdd;
	// Ajax call to get question by id
	$.get(questionUrl + '/' + id, function(data) {
		questionToAdd = data;
		// Create an array of answers and shuffle the answers
		console.log('question', questionToAdd);
		// Preview the question to make sure it is the correct one to add to the array
		$question.text(questionToAdd.text);
		$answerA.text(questionToAdd.answers[0]);
		$answerB.text(questionToAdd.answers[1]);
		$answerC.text(questionToAdd.answers[2]);
		$answerD.text(questionToAdd.answers[3]);
		// Search for the id in the array
		var notInArray = true;
		for (var i = 0; i < questionArray.length; i++) {
			if (questionArray[i]._id == id) {
				notInArray = false;
				questionArray.splice(i, 1);
				console.log('deleted', questionToAdd, 'array', questionArray);
			}
		}
		if (notInArray) {
			questionArray.push(questionToAdd);
			console.log('added', questionToAdd, 'array', questionArray);
		}
	});
	if ($(this).hasClass('question-tab')) {
		$(this).removeClass('question-tab');
	} else {
		$(this).addClass('question-tab');
	}
}

function gotoQuestions() {
	$userProfile.hide();
	$userQuestionBox.show();
	// Will contain code for answering questions...
	// To be continued...
}

function checkAnswer() {
	id = Number($(this).attr('id'));
	console.log(id);
	if(questionArray[index].correctanswer === questionArray[index].answers[id]) {
		alert('correct!');
	} else {
		alert('incorrect :(');
	}
}


// function gotoBreakdown() {
// 	// Should this be checking periodically to see if all users have answered?
// 	// Could we just update with how many have answered at intervals of 5 seconds?
// 	var index = 0;
// 	$adminProfile.hide();
// 	$breakdown.show();
// 	calculateHeight();
// 	// while(index < questionArray.length) {
// 		var answersArray = questionArray[index].incorrectanswers;
// 		$question.text(questionArray[index].text);
// 		$answerA.text(answersArray[0]);
// 		$answerB.text(answersArray[1]);
// 		$answerC.text(answersArray[2]);
// 		$answerD.text(answersArray[3]);
// 	// }
// }

});