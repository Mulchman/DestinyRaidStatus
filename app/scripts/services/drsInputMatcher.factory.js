import angular from 'angular';

angular
  .module('drsApp')
  .factory('InputMatcherService', InputMatcherService);

function InputMatcherService() {
  const matcherFns = [];
  const service = {
    addMatcherFn: addMatcherFn,
    getMatcherFns: getMatcherFns
  };
  return service;

  function addMatcherFn(name, description, testFn, runFn) {
    matcherFns.push({ name: name, description: description, testFn: testFn, runFn: runFn });
  }

  function getMatcherFns() {
    return matcherFns;
  }
}