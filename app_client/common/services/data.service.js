(function() {

  angular
    .module('meanApp')
    .service('meanData', meanData);

  meanData.$inject = ['$http', 'authentication'];
  function meanData ($http, authentication) {
	$http.defaults.headers.common.Authorization = 'Bearer '+ authentication.getToken();
    var getProfile = function () {
      return $http.get('/api/profile');
    };
	var getJogsList = function () {
      return $http.get('/api/jogs');
    };
	var getJogsByAccountType = function (accountType) {
      return $http.get('/api/jogs/accountType/' + accountType);
    };
	var getReports = function () {
      return $http.get('/api/jogs/reports');
    };
	var createJog = function (jog) {
		var user = authentication.currentUser();
		return $http.post('/api/jogs', _.extend({}, jog, {"user_id": user && user._id, "name": user && user.name}));
    };
	var deleteJog = function (jogId) {
		return $http.delete('/api/jogs/' + jogId);
    };
	var updateJog = function (jog) {
		return $http.put('/api/jogs', jog);
    };
	var updateUser = function (user) {
		return $http.put('/api/userlist', user);
    };
	var getUserlist = function () {
      return $http.get('/api/userlist', {
        headers: {
          Authorization: 'Bearer '+ authentication.getToken()
        }
      });
    };
    return {
      getProfile : getProfile,
	  getUserlist : getUserlist,
      getJogsList : getJogsList,
	  getJogsByAccountType: getJogsByAccountType,
      getReports : getReports,
	  createJog: createJog,
	  deleteJog: deleteJog,
	  updateJog: updateJog,
	  updateUser: updateUser
    };
  }

})();