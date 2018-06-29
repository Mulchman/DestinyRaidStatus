import angular from 'angular';
import _ from 'lodash';

function SettingsService($rootScope, $translate, $window, localStorageService) {
  'ngInject';

  const destinyLanguages = ['de', 'en', 'fr', 'es', 'it', 'ja', 'pt-br'];
  const service = {
    game: "D2", /* match Constants value */
    language: defaultLanguage(),
    loaded: false,
    platform: "PSN", /* match Constants value */
    save: save,
    theme: 'light'
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
      $rootScope.$broadcast('drs-settings-loaded');
      service.loaded = true;
    });
  }

  function save() {
    if (!service.loaded) {
      throw new Error("Settings haven't loaded - they can't be saved");
    }
    $rootScope.$evalAsync(function() {
      localStorageService.set('settings-1.0', _.omit(service, 'save'));
    });
  }
}

export default SettingsService;