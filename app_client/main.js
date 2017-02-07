(function () {

  angular.module('meanApp', ['ngRoute']);

  function config ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '/auth/login/login.view.html',
        controller: 'loginCtrl',
        controllerAs: 'vm'
      })
      .when('/register', {
        templateUrl: '/auth/register/register.view.html',
        controller: 'registerCtrl',
        controllerAs: 'vm'
      })
      .when('/login', {
        templateUrl: '/auth/login/login.view.html',
        controller: 'loginCtrl',
        controllerAs: 'vm'
      })
      .when('/changepassword', {
        templateUrl: '/auth/changepassword/changepassword.view.html',
        controller: 'changePasswordCtrl',
        controllerAs: 'vm'
      })
      .when('/profile', {
        templateUrl: '/profile/profile.view.html',
        controller: 'profileCtrl',
        controllerAs: 'vm'
      })
      .when('/jogslist', {
        templateUrl: '/jogslist/jogslist.view.html',
        controller: 'jogslistCtrl',
        controllerAs: 'vm'
      })
      .when('/userlist', {
        templateUrl: '/userlist/userlist.view.html',
        controller: 'userlistCtrl',
        controllerAs: 'vm'
      })
      .when('/reports', {
        templateUrl: '/reports/reports.view.html',
        controller: 'reportsCtrl',
        controllerAs: 'vm'
      })
      .otherwise({redirectTo: '/'});

    // use the HTML5 History API
    $locationProvider.html5Mode(true);
  }

  function run($rootScope, $location, authentication) {
    $rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute) {
		if(authentication.isLoggedIn() && ($location.path() === '/login' || $location.path() === "/")){
			$location.path('/profile');
		}
		else if ($location.path() !== '/login' && $location.path() !== '/register' && !authentication.isLoggedIn()) {
			$location.path('/');
		}
    });
  }
  
  angular
    .module('meanApp')
    .config(['$routeProvider', '$locationProvider', config])
    .run(['$rootScope', '$location', 'authentication', run]);

})();