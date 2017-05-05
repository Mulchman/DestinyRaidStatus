import angular from 'angular';
import _ from 'underscore';

angular
  .module('drsApp')
  .factory('SettingsService', SettingsService);

SettingsService.$inject = ['$rootScope', 'localStorageService'];

function SettingsService($rootScope, localStorageService) {
  let loaded = false;
  const service = {
    platform: "PS4",
    save: save
  };

  load();

  return service;

  function load() {
    const savedSettings = localStorageService.get('settings-1.0') || {};

    $rootScope.$evalAsync(function() {
      angular.merge(service, savedSettings);
      loaded = true;
      $rootScope.$broadcast('drs-settings-loaded');
    });
  }

  function save() {
    if (!loaded) {
      throw new Error("Settings haven't loaded - they can't be saved");
    }
    $rootScope.$evalAsync(function() {
      localStorageService.set('settings-1.0', _.omit(service, 'save'));
    });
  }
}