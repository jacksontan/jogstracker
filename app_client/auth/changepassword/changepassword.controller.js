(function () {

  angular
  .module('meanApp')
  .controller('changePasswordCtrl', changePasswordCtrl);

  changePasswordCtrl.$inject = ['$location', 'authentication', 'meanData'];
  function changePasswordCtrl($location, authentication, meanData) {
    var vm = this;
    vm.credentials = {
		password : "",
		newpassword: ""
    };

    vm.onSubmit = function () {
		if($("#confirm_password").val() !== $("#new_password").val()){
			alert("New password and confirm password do not match.");
		}
		else{
			meanData.getProfile() 
			.success(function(data) {
				console.log(data);
				vm.credentials.email = data.email;
				authentication
					.changepassword(vm.credentials)
					.error(function(err){
						alert(err.message ? err.message : err);
					})
					.then(function(){
						alert("Password Changed");
						$location.path('profile');
					});
			})
			.error(function (e) {
				console.log(e);
			});
		}
    };
  }

})();