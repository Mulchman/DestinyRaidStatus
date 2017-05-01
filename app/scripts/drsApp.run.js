function run($window, $rootScope) {
  'ngInject';

  var chromeVersion = /Chrome\/(\d+)/.exec($window.navigator.userAgent);

  // Variables for templates that webpack does not automatically correct.
  $rootScope.$DRS_VERSION = $DRS_VERSION;
}

export default run;