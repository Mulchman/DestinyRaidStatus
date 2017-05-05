
config.$inject = ['$compileProvider', 'localStorageServiceProvider'];

function config($compileProvider, localStorageServiceProvider) {
  // TODO: remove this depenency by fixing component bindings https://github.com/angular/angular.js/blob/master/CHANGELOG.md#breaking-changes-1
  $compileProvider.preAssignBindingsEnabled(true);
  // Allow chrome-extension: URLs in ng-src
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*((https?|chrome-extension):|data:image\/)/);

  localStorageServiceProvider.setPrefix('drs');
}

export default config;