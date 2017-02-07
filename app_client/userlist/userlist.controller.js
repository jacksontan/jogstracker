(function() {
  
  angular
    .module('meanApp')
    .controller('userlistCtrl', userlistCtrl);

  userlistCtrl.$inject = ['$location', 'meanData'];
  function userlistCtrl($location, meanData) {
    var vm = this;

    vm.users = {};

    meanData.getUserlist()
      .success(function(data) {
        vm.users = _.map(data, function(item, index){
			item.accountType = item.accountType.toString();
			item.tempData = _.clone(item);
			return item;
		});
      })
      .error(function (e) {
        console.log(e);
      });
	vm.enableEditor = function(user){
		user.editorEnabled = true;
	};
	vm.disableEditor = function(user, index){
		user.editorEnabled = false;
		vm.users[index].tempData = _.clone(user);
		delete vm.users[index].tempData.tempData;
	};
	vm.updateUser = function (user, index) {
		vm.users[index] = user.tempData;
		meanData.updateUser(user.tempData)
			.success(function(data) {
				user = data;
				vm.users[index].tempData = _.clone(user);
				alert("User record updated.");
			})
			.error(function (e) {
				alert(e.message || e);
				console.log(e);
			});
		vm.disableEditor(user, index);
	};
  }

})();