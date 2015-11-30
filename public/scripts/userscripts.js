$(function() {

// Selectors for page
var $avatar = $('.avatar'),
		$box = $('.box'),
		$centerBox = $('.center-box'),
		$centerBox2 = $('.center-box-2'),
		$questionBox = $('div#question-box'),
		$directions = $('#directions'),
		$questionListResults = $('#question-list-results'),
		$questionListTemplate = $('#question-list-template'),
		$scroll = $('.scroll'),
		$userProfile = $('#user-profile'),
		$userQuestionBox = $('#user-question-box'),
		$window = $(window);

// Selectors for [View Results]
var $userViewResultsBtn = $('#user-view-results-btn'),
		$userViewResultsList = $('.user-view-results-list');

// Selectors for [Answer Questions]
var $userAnswerQuestionsBtn = $('#user-answer-questions-btn');
var $userAnswerQuestionsList = $('.user-answer-questions-list');
var $gotoQuestionsBtn = $('#user-goto-questions-btn');


// Event Handlers

//##############
//# Handlebars #
//##############
var questionResults = [],
		baseUrl = '/',
		questionUrl = baseUrl + 'api/questions';
		userUrl = baseUrl + 'api/users';

var questionListSource = $questionListTemplate.html(),
		questionTemplate = Handlebars.compile(questionListSource);

$.get(questionUrl, function(data) {
	questionResults = data.questions;
	refreshQuestions();
});

// On login, get user id and user information from db
// var id = user._id;
// console.log(id);

// Event handlers for page
$avatar.on('click', changeAvatar);
$window.on('resize', calculateHeight);

// Event handlers for [View Results]
$userViewResultsBtn.on('click', openQuestionPane);
// $viewQuestionsBtn.on('click', openAddQuestionListPane);

// Event handlers for [Answer Questions]
$gotoQuestionsBtn.on('click', gotoQuestions);
$userAnswerQuestionsBtn.on('click', openUserAnswerQuestionListPane);
// $addQuestionListResults.on('click', '.click-to-select', addToQuestionArray);
// $displayQuestionsBtn.on('click', gotoBreakdown);

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
	// Trying to adjust the height when on a small device
	// if (width < 768) {
	// 	$questionBox.removeClass('center-box');
	// 	$questionBox.addClass('box');
	// } else if (width > 768) {
	// 	$questionBox.removeClass('box');		
	// 	$questionBox.addClass('center-box');
	// }
	// if (width < 768) {
	// 	$questionBox.removeAttr('margin-top');
	// 	$questionBox.css('height', height - 110);
	// 	$questionBox.css('margin', '20px 0px');
	// } else if (width > 768) {
	// 	$questionBox.removeAttr('height');		
	// 	$questionBox.css('margin-top', ((height - boxHeight - 150) / 2));
	// 	$questionBox.css('margin', '0px 20px');
	// }
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
	// $.get(questionUrl, function(data) {
	// 	questionResults = data.questions;
	// 	refreshQuestions(questionResults);
	// });
}

function refreshQuestions(questionResults) {
	console.log('refreshing questions');
	$questionListResults.empty();
	// Render the data
	var questionListHtml = questionTemplate({questions: questionResults});
	$questionListResults.append(questionListHtml);
}

function gotoQuestions() {
	$userProfile.hide();
	$userQuestionBox.show();
}

// Functions for [Answer Questions]
function openUserAnswerQuestionListPane() {
	questionArray = []; // every time this pane is opened it resets the question array
	event.preventDefault();
	$gotoQuestionsBtn.hide();
	$userViewResultsList.hide();
	$userAnswerQuestionsList.show();
	$.get(questionUrl, function(data) {
		questionResults = data.questions;
		refreshQuestionList(questionResults);
	});
	calculateHeight();
}

function refreshQuestionList(questionResults) {
	console.log('refreshing questions');
	$QuestionListResults.empty();
	// Render the data
	var QuestionListHtml = QuestionTemplate({questions: questionResults});
	$QuestionListResults.append(QuestionListHtml);
}

// function shuffle(array) {
//   var currentIndex = array.length, temporaryValue, randomIndex ;
//   // While there remain elements to shuffle...
//   while (0 !== currentIndex) {
//     // Pick a remaining element...
//     randomIndex = Math.floor(Math.random() * currentIndex);
//     currentIndex -= 1;
//     // And swap it with the current element.
//     temporaryValue = array[currentIndex];
//     array[currentIndex] = array[randomIndex];
//     array[randomIndex] = temporaryValue;
//   }
//   return array;
// }

// function addToQuestionArray() {
// 	// Get the id from the button
// 	var id = $(this).attr('data-id');
// 	var questionToAdd;
// 	// Ajax call to get question by id
// 	$.get(questionUrl + '/' + id, function(data) {
// 		questionToAdd = data;
// 		// Create an array of answers and shuffle the answers
// 		console.log('qtaia', questionToAdd.incorrectanswers);
// 		console.log('question', questionToAdd);
// 		var answersArray = questionToAdd.incorrectanswers;
// 		answersArray.push(questionToAdd.answer);
// 		answersArray = shuffle(answersArray);
// 		console.log(answersArray);
// 		// Preview the question to make sure it is the correct one to add to the array
// 		$question.text(questionToAdd.text);
// 		$answerA.text(answersArray[0]);
// 		$answerB.text(answersArray[1]);
// 		$answerC.text(answersArray[2]);
// 		$answerD.text(answersArray[3]);
// 		// Search for the id in the array
// 		var notInArray = true;
// 		for (var i = 0; i < questionArray.length; i++) {
// 			if (questionArray[i]._id == id) {
// 				notInArray = false;
// 				questionArray.splice(i, 1);
// 				console.log('deleted', questionArray);
// 			}
// 		}
// 		if (notInArray) {
// 			questionArray.push(questionToAdd);
// 			console.log('added', questionArray);
// 		}
// 		// var index = 0;
// 		// if (index === -1) {
// 		// 	questionArray.push(questionToAdd);
// 		// } else {
// 		// 	questionArray = questionArray.filter(function(element) {return element._id != id;});
// 		// 	console.log(questionArray);
// 		// }
// 	});
// 	if ($(this).hasClass('question-tab')) {
// 		$(this).removeClass('question-tab');
// 	} else {
// 		$(this).addClass('question-tab');
// 	}
// }

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