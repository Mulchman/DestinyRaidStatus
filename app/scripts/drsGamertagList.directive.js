(function() {
  'use strict';

  angular
    .module('drsApp')
    .directive('drsGamertagList', GamertagList);

  function GamertagList() {
    const directive = {
      restrict: 'E',
      templateUrl: 'scripts/drsGamertagList.template.html',
      scope: {},
      controller: GamertagListCtrl,
      controllerAs: 'vm',
      bindToController: true
    };
    return directive;
  }

  function GamertagListCtrl(GamertagListService) {
    let vm = this;

    angular.extend(vm, {
      gls: GamertagListService
    });
  }
})();