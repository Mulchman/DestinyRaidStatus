(function() {
  'use strict';

  angular
    .module('drsApp')
    .service('RaidService', RaidService);

  function RaidService() {
    // ordered based on 390 release, but it doesn't matter at all
    const raids = [
      // Crota's End- nm/hm/390
      1836893116, 1836893119, 4000873610,
      // Vault of Glass- nm/hm/390
      2659248071, 2659248068, 856898338,
      // Kings Fall- nm/hm/390
      1733556769, 3534581229, 3978884648,
      // Wrath of the Machine- nm/hm/390
      260765522, 1387993552, 3356249023
    ];

    const service = {
      raids: raids,
      getName: getName
    };
    return service;

    function getName(hash) {
      return "todo";
    }
  }
})();