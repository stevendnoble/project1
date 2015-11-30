$(function() {

// Global Variables
var $avatar = $('.avatar'),
		$box = $('.box'),
		$centerBox = $('.center-box'),
		$centerBox2 = $('.center-box-2'),
		$questionBox = $('div#question-box'),
		$questionListResults = $('#question-list-results'),
		$questionListTemplate = $('#question-list-template'),
		$scroll = $('.scroll'),
		$userProfile = $('#user-profile'),
		$userQuestionBox = $('#user-question-box'),
		$window = $(window);

// Event Handlers
var $gotoQuestionBtn = $('#goto-question-btn');

//##############
//# Handlebars #
//##############
var questionResults = [],
		baseUrl = '/',
		questionUrl = baseUrl + 'api/questions';

var questionListSource = $questionListTemplate.html(),
		questionTemplate = Handlebars.compile(questionListSource);

$.get(questionUrl, function(data) {
	questionResults = data.questions;
	refreshQuestions();
});

// Event handlers
$gotoQuestionBtn.on('click', gotoQuestion);
$avatar.on('click', changeAvatar);
$window.on('resize', calculateHeight);

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

//
//	Why do we have to do this?
//	What is it actually doing?
//
function gotoQuestion() {
	// var newWindow = window.open('', '_blank');
	// newWindow.location.href = ('/question');
	$userProfile.hide();
	$userQuestionBox.show();
}

function changeAvatar() {
	var avatarNumber = Number($avatar.attr('src').slice(14).slice(0, -4));
	avatarNumber = (avatarNumber + 1) % 20;
	var avatarFile = 'avatars/avatar' + avatarNumber + '.png';
	$avatar.attr('src', avatarFile);
	// change avatar in the database
}

function refreshQuestions() {
	console.log('refreshing questions');
	$questionListResults.empty();
	// Render the data
	var questionListHtml = questionTemplate({questions: questionResults});
	$questionListResults.append(questionListHtml);
}

});