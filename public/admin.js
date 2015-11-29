$(function() {

$(function() {

var $avatar = $('.avatar'),
		$box = $('.box'),
		$centerBox = $('.center-box'),
		$centerBox2 = $('.center-box-2'),
		$questionBox = $('div#question-box'),
		$scroll = $('.scroll'),
		$window = $(window);

// Admin Stuff
var $addQuestion = $('.add-question'),
		$addQuestionBtn = $('#add-question-btn'),
		$adminProfile = $('.admin-profile'),
		$breakdown = $('.breakdown'),
		$directions = $('#directions'),
		$directionsBtn = $('#directions-btn'),
		$displayQuestionBtn = $('#display-question-btn'),
		$questionBtn = $('#question-btn'),
		$questionIndividualResults = $('#question-individual-results'),
		$questionList = $('.question-list'),
		$questionListResults = $('#question-list-results'),
		$questionListTemplate = $('#question-list-template'),
		$questionTabBtn = $('.question-tab'),
		$submitQuestionBtn = $('#submit-question-btn'),
		$userBtn = $('#user-btn'),
		$userIndividualResults = $('#user-individual-results'),
		$userList = $('.user-list'),
		$userListResults = $('#user-list-results'),
		$userListTemplate = $('#user-list-template'),
		$userTabBtn = $('.user-tab');

var userResults = [],
		questionResults = [],
		baseUrl = '/',
		questionUrl = baseUrl + 'api/questions',
		userUrl = baseUrl + 'api/users';

var userListSource = $userListTemplate.html(),
		userTemplate = Handlebars.compile(userListSource),
		questionListSource = $questionListTemplate.html(),
		questionTemplate = Handlebars.compile(questionListSource);

// Event handlers
$avatar.on('click', changeAvatar);
$window.on('resize', calculateHeight);

// Admin Event handlers
$userBtn.on('click', openUserPane);
$questionBtn.on('click', openQuestionPane);
$addQuestionBtn.on('click', addQuestionPane);
$directionsBtn.on('click', openDirectionsPane);
$displayQuestionBtn.on('click', gotoBreakdown);
// $questionTabBtn.on('click', loadQuestionInfo);
$submitQuestionBtn.on('click', submitQuestion);
$userTabBtn.on('click', loadUserInfo);

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

// Admin only functions
// Admin only functions

function submitQuestion() {
	event.preventDefault();
	var newQuestion = $(this).serialize();
	$.post(apiUrl, newQuestion, function(data) {
		console.log(data);
	});
}

//
//	Why do we have to do this?
//	What is it actually doing?
//
function gotoBreakdown() {
	// var newWindow = window.open('', '_blank');
	// newWindow.location.href = ('/breakdown');
	$adminProfile.hide();
	$breakdown.show();
}

//
//	Why do we have to do this?
//	What is it actually doing?
//

function openUserPane() {
	event.preventDefault();
	$directions.hide();
	$questionList.hide();
	$addQuestion.hide();
	$userList.show();
	$.get(userUrl, function(data) {
		userResults = data.users;
		refreshUsers();
	});
}

function refreshUsers() {
	console.log('refreshing users');
	$userListResults.empty();
	// Render the data
	var userListHtml = userTemplate({users: userResults});
	$userListResults.append(userListHtml);
}

function loadUserInfo() {
	event.preventDefault();

}

function openQuestionPane() {
	event.preventDefault();
	$directions.hide();
	$userList.hide();
	$addQuestion.hide();
	$questionList.show();
	$.get(questionUrl, function(data) {
		questionResults = data.questions;
		refreshQuestions();
	});
}

function refreshQuestions() {
	console.log('refreshing questions');
	$questionListResults.empty();
	// Render the data
	var questionListHtml = questionTemplate({questions: questionResults});
	$questionListResults.append(questionListHtml);
}

//
// Can I not break up my js files into two and call a function from one
// in the other if it is loaded after it? 
//

function addQuestionPane() {
	event.preventDefault();
	$directions.hide();
	$userList.hide();
	$questionList.hide();
	$addQuestion.show();
	calculateHeight();
}

function openDirectionsPane() {
	event.preventDefault();
	$directions.show();
	$userList.hide();
	$questionList.hide();
	$addQuestion.hide();
}

});
});