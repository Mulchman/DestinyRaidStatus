(function() {
  'use strict';

  angular
    .module('drsApp')
    .service('GamertagListService', GamertagListService);

  function GamertagListService($q, BungieLookupService) {
    const service = {
      addGamertag: addGamertag,
      gamertags: [],
      removeGamertag: removeGamertag
    };
    return service;

    function addGamertag(gamertag, platform) {
      let p = $q.defer();

      let entry = { gamertag: gamertag, platform: platform, loading: true, bungie: {} };
      service.gamertags.push(entry);
      BungieLookupService.enqueue(entry);
      p.resolve();

      return p.promise;
    }

    function removeGamertag(gamertag, platform) {
      console.log("[drs] todo");
    }
  }
})();