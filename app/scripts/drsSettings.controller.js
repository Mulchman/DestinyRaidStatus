import angular from 'angular';

angular
  .module('drsApp')
  .controller('SettingsCtrl', SettingsCtrl);

SettingsCtrl.$inject = ['$translate', 'SettingsService'];

function SettingsCtrl($translate, SettingsService) {
  const vm = this;

  angular.extend(vm, {
    ss: SettingsService
  });

  vm.changeLanguage = changeLanguage;
  vm.languages = {
    de: 'Deutsch (incomplete)',
    en: 'English',
    es: 'Español (incomplete)',
    fr: 'Français (incomplete)',
    it: 'Italiano (incomplete)',
    'pt-br': 'Português (Brasil) (incomplete)',
    ja: '日本語 (incomplete)'
  };

  function changeLanguage() {
    vm.ss.save();

    $translate.use(vm.ss.language);
    $translate.fallbackLanguage('en');
  }
}