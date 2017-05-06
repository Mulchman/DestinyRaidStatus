import angular from 'angular';

angular
  .module('drsApp')
  .directive('drsFooter', Footer);

function Footer() {
  const directive = {
    restrict: 'E',
    templateUrl: require('app/scripts/drsFooter.template.html'),
    scope: {},
    controller: FooterCtrl,
    controllerAs: 'vm',
    bindToController: true
  };
  return directive;
}

FooterCtrl.$inject = ['SettingsService'];

function FooterCtrl(SettingsService) {
  const vm = this;

  angular.extend(vm, {
    ss: SettingsService
  });

  vm.languages = {
    de: 'Deutsch (incomplete)',
    en: 'English',
    es: 'Español (incomplete)',
    fr: 'Français (incomplete)',
    it: 'Italiano (incomplete)',
    'pt-br': 'Português (Brasil) (incomplete)',
    ja: '日本語 (incomplete)'
  };
  vm.version = $DRS_VERSION;
}