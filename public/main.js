$(function() {

var $box = $('.box'),
		$centerBox = $('.center-box'),
		$userList = $('#user-list'),
		$questionList = $('#question-list'),
		$individualResults = $('#individual-results'),
		$directions = $('#directions'),
		$addQuestion = $('.add-question'),
		$userBtn = $('#user-btn'),
		$questionBtn = $('#question-btn'),
		$addQuestionBtn = $('#add-question-btn'),
		$directionsBtn = $('#directions-btn');

var height = $(window).height();
$box.css('height', height - 90);
var boxHeight = $centerBox.height();
$centerBox.css('margin-top', ((height - boxHeight - 150) / 2));

// Event handlers
$userBtn.on('click', openUserPane);
$questionBtn.on('click', openQuestionPane);
$addQuestionBtn.on('click', addQuestionPane);
$directionsBtn.on('click', openDirectionsPane);


function openUserPane() {
	event.preventDefault();
	$directions.hide();
	$questionList.hide();
	$addQuestion.hide();
	$userList.show();
	$individualResults.show();
}

function openQuestionPane() {
	event.preventDefault();
	$directions.hide();
	$userList.hide();
	$addQuestion.hide();
	$questionList.show();
	$individualResults.show();
}

function addQuestionPane() {
	event.preventDefault();
	$directions.hide();
	$userList.hide();
	$questionList.hide();
	$individualResults.hide();
	$addQuestion.show();
}

function openDirectionsPane() {
	event.preventDefault();
	$directions.show();
	$userList.hide();
	$questionList.hide();
	$individualResults.hide();
	$addQuestion.hide();
}

});