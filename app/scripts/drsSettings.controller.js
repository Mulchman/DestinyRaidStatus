import angular from 'angular';

function SettingsController($translate, Constants, SettingsService) {
  'ngInject';

  const vm = this;

  angular.extend(vm, {
    ss: SettingsService
  });

  vm.changeLanguage = changeLanguage;
  vm.isDestiny1 = isDestiny1;
  vm.isDestiny2 = isDestiny2;
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

  function isDestiny1() {
    return vm.ss.game === Constants.games[0];
  }

  function isDestiny2() {
    return vm.ss.game === Constants.games[1];
  }
}

export default SettingsController;