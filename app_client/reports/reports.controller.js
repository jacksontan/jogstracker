(function() {
  
  angular
    .module('meanApp')
    .controller('reportsCtrl', reportsCtrl);

  reportsCtrl.$inject = ['meanData'];
  function reportsCtrl(meanData) {
    var vm = this;
    vm.reports = {};
    meanData.getReports()
      .success(function(data) {
        vm.reports = data;
      })
      .error(function (e) {
        console.log(e);
      });
  }

})();