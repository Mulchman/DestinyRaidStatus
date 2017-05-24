function UtilsService($sanitize) {
  'ngInject';

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

export default UtilsService;