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

function FooterCtrl() {
  const vm = this;

  vm.version = $DRS_VERSION;
}