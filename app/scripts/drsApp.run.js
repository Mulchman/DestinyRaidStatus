
run.$inject = ['$window', '$rootScope'];

function run($window, $rootScope) {
  $window.initgapi = function() {

  };

  // Variables for templates that webpack does not automatically correct.
  $rootScope.$DRS_VERSION = $DRS_VERSION;
}

export default run;