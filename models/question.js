var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		passportLocalMongoose = require('passport-local-mongoose');

var QuestionSchema = new Schema({
	text: String,
	answer: String,
	incorrectanswers: Array,
	userscorrect: [
	{
		type: Schema.Types.ObjectId,
		ref: 'User'
	}],
	usersincorrect0: [
	{
		type: Schema.Types.ObjectId,
		ref: 'User'
	}],
	usersincorrect1: [
	{
		type: Schema.Types.ObjectId,
		ref: 'User'
	}],
	usersincorrect2: [
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