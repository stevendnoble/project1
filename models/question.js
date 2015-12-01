var mongoose = require('mongoose'),
		Schema = mongoose.Schema;
		passportLocalMongoose = require('passport-local-mongoose');

var QuestionSchema = new Schema({
	label: String,
	text: String,
	correctanswer: String,
	answers: [String],
	usersanswers0: [
	{
		type: Schema.Types.ObjectId,
		ref: 'User'
	}],
	usersanswers1: [
	{
		type: Schema.Types.ObjectId,
		ref: 'User'
	}],
	usersanswers2: [
	{
		type: Schema.Types.ObjectId,
		ref: 'User'
	}],
	usersanswers3: [
	{
		type: Schema.Types.ObjectId,
		ref: 'User'
	}]
});

QuestionSchema.plugin(passportLocalMongoose, {
	populateFields: 'users'
});

var Question = mongoose.model('Question', QuestionSchema);
module.exports = Question;