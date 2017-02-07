(function() {
  
  angular
    .module('meanApp')
    .controller('jogslistCtrl', jogslistCtrl);

  jogslistCtrl.$inject = ['meanData'];
  function jogslistCtrl(meanData) {
    var vm = this;

    vm.jogs = {};

	meanData.getJogsList()
		.success(function(data) {
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
					meanData.getJogsByAccountType(1)
						.success(function(data) {
							//remove own records from the list of admins
	//						vm.jogs.admins = data;
							vm.jogs.admins = _.reject(data, function(item, index){
								return item.user_id === userData._id;
							});
							vm.jogs.admins.title = "ADMINS";
						})
						.error(function (e) {
							alert(e.message || e);
							console.log(e);
						});
					meanData.getJogsByAccountType(2)
						.success(function(data) {
							vm.jogs.managers = data;
							vm.jogs.managers.title = "MANAGERS";
						})
						.error(function (e) {
							alert(e.message || e);
							console.log(e);
						});
				}
				//for managers get only users
				meanData.getJogsByAccountType(3)
					.success(function(data) {
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
	vm.onSubmit = function () {
		meanData.createJog(vm.jog)
			.success(function(data) {
				alert("Jog record created.");
				vm.jogs.own.push(data);
			})
			.error(function (e) {
				alert(e.message || e);
				console.log(e);
			});
	};
	vm.deleteJog = function (jogId) {
		meanData.deleteJog(jogId)
			.success(function(data) {
				vm.jogs.splice(_.findIndex(vm.jogs, {
					_id: jogId
				}), 1);
				alert("Jog record deleted.");
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
//				jogRecord = data;
				vm.jogs[index1][index2] = data;
				alert("Jog record updated.");
			})
			.error(function (e) {
				alert(e.message || e);
				console.log(e);
			});
		vm.disableEditor(jogRecord);
	};
  }

})();