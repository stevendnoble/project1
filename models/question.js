var mongoose = require('mongoose'),
		Schema = mongoose.Schema;
		passportLocalMongoose = require('passport-local-mongoose');

var QuestionSchema = new Schema({
	label: {
		type: String,
		unique: true
	},
	text: String,
	correctanswer: String,
	answers: [String],
	show: {
		type: Boolean,
		default: false
	},
	usersanswers0: [String],
	usersanswers1: [String],
	usersanswers2: [String],
	usersanswers3: [String]
});

var Question = mongoose.model('Question', QuestionSchema);
module.exports = Question;