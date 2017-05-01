import angular from 'angular';

angular
  .module('drsApp')
  .directive('drsFooter', Footer);

function Footer() {
  const directive = {
    restrict: 'E',
    templateUrl: require('app/scripts/drsFooter.template.html'),
    scope: {}
  };
  return directive;
}