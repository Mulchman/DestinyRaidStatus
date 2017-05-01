(function() {
  'use strict';

  angular
    .module('drsApp')
    .directive('drsHeader', Header);

  function Header() {
    const directive = {
      restrict: 'E',
      templateUrl: 'scripts/drsHeader.template.html',
      scope: {},
      controller: HeaderCtrl,
      controllerAs: 'vm',
      bindToController: true
    };
    return directive;
  }

  function HeaderCtrl() {
    let vm = this;
  }
})();