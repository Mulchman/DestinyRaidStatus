(function() {
  'use strict';

  angular
    .module("drsApp")
    .directive('drsHeader', drsHeader);

  function drsHeader() {
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
    var vm = this;
    vm.ps4 = true;
  }
})();