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
				var condition;
				if (user.accountType !== 1 && user.accountType !== 2) {
					res.status(401).json({
					  "message" : "UnauthorizedError: should be admin."
					});
				} 
				else {
					if(user.accountType === 2){
						condition = {"accountType": 3};	//managers can only see users
					}
					User
						.find(condition)
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
