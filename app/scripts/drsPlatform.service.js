import angular from 'angular';

angular
  .module('drsApp')
  .factory('PlatformService', PlatformService);

PlatformService.$inject = ['$rootScope', 'SettingsService'];

function PlatformService($rootScope, SettingsService) {
  const platforms = ['PS4', 'XB1'];
  const service = {
    active: platforms[0],
    platforms: platforms
  };

  $rootScope.$on("drs-settings-loaded", function() {
    service.active = (platforms.indexOf(SettingsService.platform) !== -1)
      ? SettingsService.platform
      : platforms[0];
  });

  return service;
}