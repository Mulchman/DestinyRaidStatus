import angular from 'angular';

angular
  .module('drsApp')
  .factory('PlatformService', PlatformService);

function PlatformService() {
  const platforms = ['PS4', 'XB1'];
  const service = {
    active: platforms[0],
    platforms: platforms
  };
  return service;
}