(function() {
  'use strict';

  angular
    .module('drsApp')
    .service('BungieLookupService', BungieLookupService);

  function BungieLookupService() {
    const service = {
      enqueue: enqueue
    };
    return service;

    function enqueue(entry) {
      console.log("[drs] async lookup this user on b.net");
    }
  }
})();