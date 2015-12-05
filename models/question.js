 var mongoose = require('mongoose'),
		Schema = mongoose.Schema;
		passportLocalMongoose = require('passport-local-mongoose');

var QuestionSchema = new Schema({
	label: {
		type: String,
		unique: true,
		required: true
	},
	text: {
		type: String,
		required: true
	},
	correctanswer: {
		type: String,
		required: true
	},
	answers: {
		type: [String],
		required: true
	},
	show: {
		type: Boolean,
		default: false,
	},
	usersanswers0: [String],
	usersanswers1: [String],
	usersanswers2: [String],
	usersanswers3: [String]
});

var Question = mongoose.model('Question', QuestionSchema);
module.exports = Question;