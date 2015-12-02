$(function() {

// Selectors for page manipulation
var $avatar = $('.avatar'),
		$box = $('.box'),
		$centerBox = $('.center-box'),
		$centerBox2 = $('.center-box-2'),
		$centerBox3 = $('.center-box-3'),
		$centerBox4 = $('.center-box-4'),
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
		$correctanswer = $('#correctanswer'),
		$answers0 = $('#answers0'),
		$answers1 = $('#answers1'),
		$answers2 = $('#answers2'),
		$label = $('#label'),
		$text = $('#text'),
		// [Preview]
		$formControl = $('.form-control'),
		$question = $('.question'),
		$answerA = $('.answer-a'),
		$answerB = $('.answer-b'),
		$answerC = $('.answer-c'),
		$answerD = $('.answer-d');

// Selectors for [View Questions]
var $addQuestionList = $('.add-question-list'),
		$addQuestionListResults = $('#add-question-list-results'),
		$addQuestionListTemplate = $('#add-question-list-template'),
		$addQuestionTabBtn = $('.add-question-tab'),
		$adminProfile = $('#admin-profile'),
		$breakdown = $('.breakdown');

// Selectors for [View Results] and [View Users]
var $questionIndividualResults = $('#question-individual-results'),
		$questionList = $('.question-list'),
		$questionListResults = $('#question-list-results'),
		$questionListTemplate = $('#question-list-template'),
		$questionTabBtn = $('.question-tab'),
		$userIndividualResults = $('#user-individual-results'),
		$userList = $('.user-list'),
		$userListResults = $('#user-list-results'),
		$userListTemplate = $('#user-list-template'),
		$userTabBtn = $('.user-tab');

// URLs for api calls to the database
var baseUrl = '/',
		questionUrl = baseUrl + 'api/questions/',
		userUrl = baseUrl + 'api/users/';

// Handlebars templates and compilers for adding user buttons and
// question buttons to the [View Results] and [View Users] buttons
var userListSource = $userListTemplate.html(),
		userTemplate = Handlebars.compile(userListSource),
		questionListSource = $questionListTemplate.html(),
		questionTemplate = Handlebars.compile(questionListSource),
		addQuestionListSource = $addQuestionListTemplate.html(),
		addQuestionTemplate = Handlebars.compile(addQuestionListSource);

// Global variables
var questionArray = []; // Array for questions to be displayed to students
var index = 0;

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
$submitQuestionBtn.on('click', submitQuestion);

// Event handlers for [View Questions]
$addQuestionListResults.on('click', '.click-to-select', selectQuestion);
$displayQuestionsBtn.on('click', gotoBreakdown);

// Event handlers for detailed information by user or question
// need to put handler on the 
$userListResults.on('click', '.user-tab', loadUserInfo);
$questionListResults.on('click', '.question-tab', loadQuestionInfo);

// Generic functions
calculateHeight();
function calculateHeight() {
	var height = $window.height();
	var width = $window.width();
	var boxHeight = $centerBox.height();
	var boxHeight2 = $centerBox2.height();
	var boxHeight3 = $centerBox3.height();
	var boxHeight4 = $centerBox4.height();
	$box.css('height', height - 90);
	$scroll.css('height', height - 130);
	$centerBox.css('margin-top', ((height - boxHeight - 150) / 2));	
	$centerBox2.css('margin-top', ((height - boxHeight2 - 150) / 2));	
	$centerBox3.css('margin-top', ((height - boxHeight3 - 150) / 2));	
	$centerBox4.css('margin-top', ((height - boxHeight4 - 150) / 2));	
}

// On click, changes the avatar image, but does not yet save to the database
function changeAvatar() {
	var avatarNumber = Number($avatar.attr('src').slice(14).slice(0, -4));
	avatarNumber = (avatarNumber + 1) % 20;
	var avatarFile = 'avatars/avatar' + avatarNumber + '.png';
	$avatar.attr('src', avatarFile);
	// change avatar in the database
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
	answers = shuffle(answers);
	// Add values to our newQuestion object
	newQuestion.label = $label.val();
	newQuestion.text = $text.val();
	newQuestion.correctanswer = correctanswer;
	newQuestion.answers = answers;
	// Add newQuestion to the db and clear the form
	$.post(questionUrl, newQuestion, function(data) {
		console.log('question added');
	});
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
	$.get(questionUrl, function(data) {
		questionResults = data.questions;
		refreshQuestionList(questionResults);
	});
	calculateHeight();
}

// Refresh the question list with the questions from the db
function refreshQuestionList(questionResults) {
	console.log('refreshing questions');
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
		// Create an array of answers and shuffle the answers
		// Preview the question to make sure it is the correct one to add to the array
		$question.text(questionToAdd.text);
		$answerA.text(questionToAdd.answers[0]);
		$answerB.text(questionToAdd.answers[1]);
		$answerC.text(questionToAdd.answers[2]);
		$answerD.text(questionToAdd.answers[3]);
	});
	// Change the color of the button and value of show in the database
	if ($(this).hasClass('question-tab')) {
		$(this).removeClass('question-tab');
		$.ajax({
			type: 'PATCH',
			url: questionUrl + id,
			data: {show: true},
			success: function(data) {
				console.log('changed to show, added to array');
				questionArray.push(data);
			}
		});
	} else {
		$(this).addClass('question-tab');
		$.ajax({
			type: 'PATCH',
			url: questionUrl + id,
			data: {show: false},
			success: function(data) {
				console.log('changed to not show, deleted from array');
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
	// Should this be checking periodically to see if all users have answered?
	// Could we just update with how many have answered at intervals of 5 seconds?
	$adminProfile.hide();
	$breakdown.show();
	calculateHeight();
	// while(index < questionArray.length) {
		$question.text(questionArray[index].text);
		$answerA.text(questionArray[index].answers[0]);
		$answerB.text(questionArray[index].answers[1]);
		$answerC.text(questionArray[index].answers[2]);
		$answerD.text(questionArray[index].answers[3]);
	// }
}

///////////////////////////////////////////////////
// Functions for [View Users] and [View Results] //
///////////////////////////////////////////////////

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
	console.log('refreshing users');
	$userListResults.empty();
	// Render the data
	var userListHtml = userTemplate({users: userResults});
	$userListResults.append(userListHtml);
}

// Load the results of individual users
function loadUserInfo() {
	event.preventDefault();
	$userIndividualResults.empty();
	$userIndividualResults.text('coming soon...');
	// Function will load individual results by user
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
	console.log('refreshing questions');
	// Render the data
	var questionListHtml = questionTemplate({questions: questionResults});
	$questionListResults.append(questionListHtml);
}

// Load the results of individual questions
function loadQuestionInfo() {
	$questionIndividualResults.empty();
	$questionIndividualResults.text('coming soon...');
	event.preventDefault();
	// Function will load individual results by question
}

// Questions:
//
// Should I be checking the server periodically for answers from users?

});