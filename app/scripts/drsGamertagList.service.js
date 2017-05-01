(function() {
  'use strict';

  angular
    .module('drsApp')
    .service('GamertagListService', GamertagListService);

  function GamertagListService($q) {
    const service = {
      addGamertag: addGamertag,
      gamertags: [],
      removeGamertag: removeGamertag
    };
    return service;

    function addGamertag(gamertag, platform) {
      let p = $q.defer();

      let pair = { gamertag: gamertag, platform: platform };

      service.gamertags.push(pair);
      p.resolve();

      return p.promise;
    }

    function removeGamertag(gamertag, platform) {
      console.log("[drs] todo");
    }
  }
})();