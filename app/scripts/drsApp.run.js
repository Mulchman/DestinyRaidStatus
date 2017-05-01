function run($window, $rootScope) {
  'ngInject';

  // Variables for templates that webpack does not automatically correct.
  $rootScope.$DRS_VERSION = $DRS_VERSION;
}

export default run;