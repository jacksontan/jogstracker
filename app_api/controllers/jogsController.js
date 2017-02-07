var mongoose = require('mongoose');
var User = mongoose.model('User');
var Jog = mongoose.model('Jog');
var ObjectId = mongoose.Types.ObjectId;

var formatJogsWithUser = function(jogs, user){
	var data = [];
	var isArray = true;
	var jogModel;
	if(!(jogs instanceof Array)){
		isArray = false;
		jogs = [jogs];
	}
	for(var i=0; i<jogs.length; i++){
		jogModel = new Jog(jogs[i]);
		data.push({
			_id: jogModel._id,
			user_id: jogModel.user_id._id,
			name: user ? user.name : jogModel.user_id.name,
			date: (jogModel.date.getMonth()+1) + "/" + jogModel.date.getDate() + "/" + jogModel.date.getFullYear(),
			time: jogModel.time,
			distance: jogModel.distance,
			weekNo: jogModel.weekNo,
			speed: jogModel.getSpeed()
		});
	}
	return isArray ? data : data[0];
}
var getWeeklyAverageSpeed = function(jogs){
	var report = [];
	var weekCount = _.unique(_.pluck(jogs, "weekNo"));
	_.each(weekCount, function(weekNo, index){
		var ctr = 0;
		var totalWeekSpeed = _.reduce(jogs, function(memo, item, index){
			var speed = item.distance/item.time;
			if(item.weekNo === weekNo){
				ctr++;
				return memo + speed;
			}
			else { return 0;}
			}, 0);
		report.push({
			"weekNo": weekNo,
			"avgSpeed": totalWeekSpeed/ctr
		});
	});
	return report;
}
var formatDateRange = function(fromDate, toDate){
	var dateRange;
	if(fromDate || toDate){
		dateRange = {};
		if(fromDate){
			dateRange["$gte"] = new Date(fromDate);
		}
		if(toDate){
			dateRange["$lte"] = new Date(toDate);
		}
	}
	return dateRange;
}
module.exports.getOwnJogs = function(req, res) {
	console.log("Getting Jogs");
	var condition, dateRange;
	var returnObj = [];
	condition = {user_id: ObjectId(req.payload._id)};
	dateRange = formatDateRange(req.query.fromDate, req.query.toDate);
	if(dateRange){
		condition.date = dateRange;
	}
	Jog
		.find(condition)
		.populate("user_id")
		.exec(function(err, jogs){
			if (err) {
				res.status(404).json(err);
				return;
			}
			else{
				returnObj = formatJogsWithUser(jogs);
				res.status(200).json(returnObj);
			}
		});
};
module.exports.getJogsByAccountType = function(req, res) {
	console.log("Getting Jogs");
	var returnObj = [];
	var accountType = req.params.accountType;
	User.findById(req.payload._id)
		.exec(function(err, user){
			if(user.accountType === 3){ 	//check if user is allowed to get other users jog records
				res.status(401).json({message: "UnauthorizedError: User not allowed to get other records"});
			}
			else if(user.accountType === 2 && (accountType === "1" || accountType === "2")){	//managers can only see other regular users
				res.status(401).json({message: "UnauthorizedError: User not allowed to get admin and manager records"});
			}
			else{
				User
					.find({accountType: accountType})
					.exec(function(err, users) {
						var condition, dateRange;
						condition = {
							"user_id": { "$in": users.map(function(user) {
									return user._id;
								})
							}
						};
						dateRange = formatDateRange(req.query.fromDate, req.query.toDate);
						if(dateRange){
							condition.date = dateRange;
						}
						Jog
							.find(condition)
							.populate("user_id")
							.exec(function(err, jogs){
								if (err) {
									res.status(404).json(err);
									return;
								}
								else{
									returnObj = formatJogsWithUser(jogs);
									res.status(200).json(returnObj);
								}
							});
					});
			}
		});
};
module.exports.getWeeklyJogReport = function(req, res) {
	console.log("Getting Jogs");
	var condition, dateRange;
	var returnObj = [];
	condition = {user_id: ObjectId(req.payload._id)};
	dateRange = formatDateRange(req.query.fromDate, req.query.toDate);
	if(dateRange){
		condition.date = dateRange;
	}
	Jog
		.aggregate([
	{
		$match: condition
	},
	{
		$group: {
			_id:{
				$dateToString:{format: "%Y-W%U", date: "$date"}
			}, 
			avgSpeed: {
				$avg: {
					$divide: ["$distance", "$time"]
				}
			}
		}
	},
	{
		$sort: {_id: 1},
	}], function(err, jogs){
		if (err) {
			res.status(404).json(err);
			return;
		}
		else{
			res.status(200).json(jogs);
		}
	})
};
module.exports.createJog = function(req, res) {
	console.log("Creating Jogs");
	var jog = new Jog();
	if(req.body.user_id){
		jog.user_id = ObjectId(req.body.user_id);
	}
	jog.date = new Date(req.body.date);
	jog.time = req.body.time;
	jog.distance = req.body.distance;
	jog.save(function(err, jog) {
		if (err) {
			res.status(404).json(err);
			return;
		}
		else{
			User
				.findById(jog.user_id)
				.exec(function(err, user) {
					res.status(200);
					res.json(formatJogsWithUser(jog, user));
				});
		}
	});
};
module.exports.deleteJog = function(req, res) {
	console.log("Deleting Jogs");
	var jogId = req.params.id;
	if(!jogId){
		res.status(400).json({message: "Jog id is required."});
	}
	else{
		Jog.findByIdAndRemove(jogId, function(err, jog){
			if(err || !jog){ 
				res.status(404).json(err || {message: "No record was found."});
				return;
			}
			else{
				res.status(200);
				res.json({});
			}
		});
	}
};
module.exports.updateJog = function(req, res) {
	console.log("Updating Jogs");
	Jog.findByIdAndUpdate(req.body._id, req.body, function(err, jog) {
		if (err) {
			res.status(404).json(err);
			return;
		}
		else{
			Jog.findById(jog._id, function(err, newJog){
				res.status(200);
				res.json(formatJogsWithUser(newJog));
			}).populate("user_id");
		}
	});
};
