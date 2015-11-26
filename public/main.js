$(function() {

var $window = $(window),
		$avatar = $('.avatar'),
		$box = $('.box'),
		$centerBox = $('.center-box'),
		$userList = $('#user-list'),
		$questionList = $('#question-list'),
		$scroll = $('.scroll'),
		$individualResults = $('#individual-results'),
		$directions = $('#directions'),
		$addQuestion = $('.add-question'),
		$userBtn = $('#user-btn'),
		$questionBtn = $('#question-btn'),
		$addQuestionBtn = $('#add-question-btn'),
		$directionsBtn = $('#directions-btn'),
		$questionBox = $('div#question-box');

// Event handlers
$userBtn.on('click', openUserPane);
$questionBtn.on('click', openQuestionPane);
$addQuestionBtn.on('click', addQuestionPane);
$directionsBtn.on('click', openDirectionsPane);
$avatar.on('click', changeAvatar);
$window.on('resize', calculateHeight);


calculateHeight();

function calculateHeight() {
	var height = $window.height();
	var width = $window.width();
	var boxHeight = $centerBox.height();

	// Trying to adjust the height when on a small device
	// if (width < 768) {
	// 	$questionBox.removeClass('center-box');
	// 	$questionBox.addClass('box');
	// } else if (width > 768) {
	// 	$questionBox.removeClass('box');		
	// 	$questionBox.addClass('center-box');
	// }
	if (width < 768) {
		$questionBox.removeAttr('margin-top');
		$questionBox.css('height', height - 110);
		$questionBox.css('margin', '20px 0px');
	} else if (width > 768) {
		$questionBox.removeAttr('height');		
		$questionBox.css('margin-top', ((height - boxHeight - 150) / 2));
		$questionBox.css('margin', '0px 20px');
	}

	$box.css('height', height - 90);
	$scroll.css('height', height - 130);
	$centerBox.css('margin-top', ((height - boxHeight - 150) / 2));	
}

function changeAvatar() {
	var avatarNumber = Number($avatar.attr('src').slice(14).slice(0, -4));
	avatarNumber = (avatarNumber + 1) % 20;
	$avatar.attr('src', 'avatars/avatar' + avatarNumber + '.png');
}

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
	calculateHeight();
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