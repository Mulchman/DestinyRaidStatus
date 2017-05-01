(function() {
  'use strict';

  angular
    .module('drsApp')
    .service('UtilsService', Utils);

  function Utils() {
    const service = {
      isNullOrEmpty: isNullOrEmpty
    };
    return service;

    function isNullOrEmpty(input) {
      return ((typeof input === 'undefined') || (input.trim() === ''));
    }
  }
})();