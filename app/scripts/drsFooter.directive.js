(function() {
  'use strict';

  angular
    .module('drsApp')
    .directive('drsFooter', Footer);

  function Footer() {
    const directive = {
      restrict: 'E',
      templateUrl: 'scripts/drsFooter.template.html',
      scope: {},
      controller: FooterCtrl,
      controllerAs: 'vm',
      bindToController: true
    };
    return directive;
  }

  function FooterCtrl() {
    let vm = this;
  }
})();