var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.userlistRead = function(req, res) {
	
	if (!req.payload._id) {
		res.status(401).json({
		  "message" : "UnauthorizedError: should be logged in."
		});
	}
	else {
		User.findById(req.payload._id)
			.exec(function(err, user){
				if (user.accountType !== 1) {
					res.status(401).json({
					  "message" : "UnauthorizedError: should be admin."
					});
				} 
				else {
					User
						.find()
						.exec(function(err, users) {
							res.status(200).json(users);
						});
				}
			});
	}
};
module.exports.updateUser = function(req, res) {

	if (!req.payload._id) {
		res.status(401).json({
		  "message" : "UnauthorizedError: should be logged in."
		});
	}
	else {
		User.findById(req.payload._id)
			.exec(function(err, user){
				if (err) {
					res.status(404).json(err);
					return;
				}
				else{
					if (user.accountType !== 1 && user.accountType !== 2) {
						res.status(401).json({
						  "message" : "UnauthorizedError: should be admin or manager."
						});
						return;
					} 
					else{
						User.findByIdAndUpdate(req.body._id, {
								name: req.body.name,
								accountType: req.body.accountType
						}, function(err, jog) {
							if (err) {
								res.status(404).json(err);
								return;
							}
							else{
								User.findById(jog._id, function(err, newUser){
									res.status(200);
									res.json(newUser);
								});
							}
						});
					}
				}
			});
	}
	
};
