var request = require('request'),
		expect = require('chai').expect,
		baseUrl = 'http://localhost:5000';
		// baseUrl = 'https://pulse-check.herokuapp.com';

describe('Users', function() {
	it('should show a sign up page on GET /signup', function (done) {
		request(baseUrl + '/signup', function(error, response, body) {
			expect(response.statusCode).to.equal(200);
			done();
		});
	});
	it('should show a sign up page on GET /login', function (done) {
		request(baseUrl + '/login', function(error, response, body) {
			expect(response.statusCode).to.equal(200);
			done();
		});
	});
	it('should show a sign up page on GET /admin', function (done) {
		request(baseUrl + '/admin', function(error, response, body) {
			expect(response.statusCode).to.equal(200);
			done();
		});
	});
	it('should show a sign up page on GET /profile', function (done) {
		request(baseUrl + '/profile', function(error, response, body) {
			expect(response.statusCode).to.equal(200);
			done();
		});
	});
	it('should show a sign up page on GET /', function (done) {
		request(baseUrl + '/', function(error, response, body) {
			expect(response.statusCode).to.equal(200);
			done();
		});
	});
});


