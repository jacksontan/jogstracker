(function() {
  
  angular
    .module('meanApp')
    .controller('profileCtrl', profileCtrl);

  profileCtrl.$inject = ['$location', 'meanData'];
  function profileCtrl($location, meanData) {
    var vm = this;

    vm.user = {};

    meanData.getProfile()
      .success(function(data) {
        vm.user = data;
		if(data.accountType === 1){
			vm.user.accountTypeLabel = "Admin";
		}
		else if(data.accountType === 2){
			vm.user.accountTypeLabel = "Manager";
		}
		else{
			vm.user.accountTypeLabel = "User";
		}
      })
      .error(function (e) {
        console.log(e);
      });
  }

})();