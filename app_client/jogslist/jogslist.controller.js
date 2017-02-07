(function() {
  
  angular
    .module('meanApp')
    .controller('jogslistCtrl', jogslistCtrl);

  jogslistCtrl.$inject = ['meanData'];
  function jogslistCtrl(meanData) {
    var vm = this;
	var convertDate = function(dataParam){
		var objectArr = dataParam, isArray=true;
		if(!(dataParam instanceof Array)){
			isArray = false;
			objectArr = [dataParam];
		}
		for(var i=0; i<objectArr.length;i++){
			objectArr[i].date = new Date(objectArr[i].date);
		}
		return isArray ? objectArr : objectArr[0];
	}
	vm.getJogs = function(){
		vm.jogs = {};
		var fromDate = vm.filter ? vm.filter.fromDate : "";
		var toDate = vm.filter ? vm.filter.toDate : "";
		meanData.getJogsList(fromDate, toDate)
			.success(function(data) {
				data = convertDate(data);
				vm.jogs.own = data;
				vm.jogs.own.title = "OWN";
			})
			.error(function (e) {
				alert(e.message || e);
				console.log(e);
			});
		meanData.getProfile()
			.success(function(data) {
				var userData = data;
				if(userData.accountType !== 3){
					if(userData.accountType === 1){	//for admins get all admins and managers
						meanData.getJogsByAccountType(1, fromDate, toDate)
							.success(function(data) {
								data = convertDate(data);
								//remove own records from the list of admins
								vm.jogs.admins = _.reject(data, function(item, index){
									return item.user_id === userData._id;
								});
								vm.jogs.admins.title = "ADMINS";
							})
							.error(function (e) {
								alert(e.message || e);
								console.log(e);
							});
						meanData.getJogsByAccountType(2, fromDate, toDate)
							.success(function(data) {
								data = convertDate(data);
								vm.jogs.managers = data;
								vm.jogs.managers.title = "MANAGERS";
							})
							.error(function (e) {
								alert(e.message || e);
								console.log(e);
							});
					}
					//for managers get only users
					meanData.getJogsByAccountType(3, fromDate, toDate)
						.success(function(data) {
							data = convertDate(data);
							vm.jogs.users = data;
							vm.jogs.users.title = "USERS";
						})
						.error(function (e) {
							alert(e.message || e);
							console.log(e);
						});
				}
			})
			.error(function (e) {
				console.log(e);
			});
	}
	vm.onSubmit = function () {
		meanData.createJog(vm.jog)
			.success(function(data) {
				alert("Jog record created.");
				data = convertDate(data);
				vm.jogs.own.push(data);
				vm.jog = {};
			})
			.error(function (e) {
				alert(e.message || e);
				console.log(e);
			});
	};
	vm.deleteJog = function (index1, index2) {
		var jog = vm.jogs[index1][index2];
		meanData.deleteJog(jog._id)
			.success(function(data) {
				vm.jogs[index1].splice(index2, 1);
/*				vm.jogs.splice(_.findIndex(vm.jogs, {
					_id: jogId
				}), 1);
*/				alert("Jog record deleted.");
			})
			.error(function (e) {
				alert(e.message || e);
				console.log(e);
			});
	};
	vm.enableEditor = function(jogRecord){
		jogRecord.editorEnabled = true;
	};
	vm.disableEditor = function(jogRecord){
		jogRecord.editorEnabled = false;
	};
	vm.updateJog = function (jogRecord, index1, index2) {
		meanData.updateJog(jogRecord)
			.success(function(data) {
				data = convertDate(data);
				vm.jogs[index1][index2] = data;
				alert("Jog record updated.");
			})
			.error(function (e) {
				alert(e.message || e);
				console.log(e);
			});
		vm.disableEditor(jogRecord);
	};
	vm.getJogs();
  }

})();