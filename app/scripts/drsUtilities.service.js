import angular from 'angular';

angular
  .module('drsApp')
  .factory('UtilsService', Utils);

function Utils() {
  const service = {
    isNullOrEmpty: isNullOrEmpty
  };
  return service;

  function isNullOrEmpty(input) {
    return ((typeof input === 'undefined') || (input.trim() === ''));
  }
}