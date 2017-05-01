import angular from 'angular';

angular
  .module('drsApp')
  .directive('drsHeader', Header);

function Header() {
  const directive = {
    restrict: 'E',
    templateUrl: require('app/scripts/drsHeader.template.html'),
    scope: {}
  };
  return directive;
}