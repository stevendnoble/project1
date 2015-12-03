var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new Schema({
	name: {
		type: String
	},
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
	admin: {
		type: Boolean,
		default: false
	},
	questions: [{
		type: Schema.Types.ObjectId,
		ref: 'Question'
	}],
	useranswers: [String]
});

var validatePassword = function (password, callback) {
	if (password.length < 6) {
		return callback({ code: 422, message: 'Password must be at least 6 characters.' });
	}
	return callback(null);
};

UserSchema.plugin(passportLocalMongoose, {
	populateFields: 'questions',
	passwordValidator: validatePassword
});

var User = mongoose.model('User', UserSchema);
module.exports = User;