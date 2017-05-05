import angular from 'angular';
import _ from 'underscore';

angular
  .module('drsApp')
  .factory('SettingsService', SettingsService);

SettingsService.$inject = ['$rootScope', '$translate', '$window', 'localStorageService'];

function SettingsService($rootScope, $translate, $window, localStorageService) {
  let loaded = false;
  const destinyLanguages = ['de', 'en', 'fr', 'es', 'it', 'ja', 'pt-br'];
  const service = {
    language: defaultLanguage(),
    platform: "PS4",
    save: save
  };

  load();

  return service;

  function defaultLanguage() {
    const browserLang = ($window.navigator.language || 'en').toLowerCase();
    return _.find(destinyLanguages, (lang) => browserLang.startsWith(lang)) || 'en';
  }

  function load() {
    const savedSettings = localStorageService.get('settings-1.0') || {};

    $rootScope.$evalAsync(function() {
      angular.merge(service, savedSettings);
      $translate.use(service.language);
      $translate.fallbackLanguage('en');
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