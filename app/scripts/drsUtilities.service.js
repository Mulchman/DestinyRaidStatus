import angular from 'angular';

angular
  .module('drsApp')
  .factory('UtilsService', Utils);

Utils.$inject = ['$sanitize'];

function Utils($sanitize) {
  const service = {
    isUndefinedOrNullOrEmpty: isUndefinedOrNullOrEmpty,
    sanitizeInput: sanitizeInput
  };
  return service;

  function isUndefinedOrNullOrEmpty(input) {
    return ((typeof input === 'undefined') || (input === null) || (input.trim() === ''));
  }

  function sanitizeInput(input) {
    return isUndefinedOrNullOrEmpty(input) ? null : $sanitize(input.trim());
  }
}