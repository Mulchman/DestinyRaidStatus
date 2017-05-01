(function() {
  'use strict';

  angular
    .module('drsApp')
    .service('PlatformService', PlatformService);

  function PlatformService() {
    const platforms = ['PS4', 'XB1'];
    const service = {
      active: platforms[0],
      platforms: platforms
    };
    return service;
  }
})();