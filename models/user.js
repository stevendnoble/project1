var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new Schema({
	username: {
		type: String
	},
	password: {
		type: String
	},
	avatar: {
		type: String,
		default: 'avatars/avatar0.png'
	},
	admin: Boolean,
	questions: [{
		type: Schema.Types.ObjectId,
		ref: 'Question'
	}],
	useranswer: Array
});

UserSchema.plugin(passportLocalMongoose, {
	populateFields: 'questions'
});

var User = mongoose.model('User', UserSchema);
module.exports = User;