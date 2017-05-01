(function() {
  'use strict';

  angular
    .module('drsApp')
    .directive('drsInputGamertag', InputGamertag);

  function InputGamertag() {
    const directive = {
      restrict: 'E',
      templateUrl: 'scripts/drsInputGamertag.template.html',
      scope: {},
      controller: InputGamertagCtrl,
      controllerAs: 'vm',
      bindToController: true
    };
    return directive;
  }

  function InputGamertagCtrl(GamertagListService, PlatformService) {
    let vm = this;

    vm.add = add;
    vm.gamertag = "";

    angular.extend(vm, {
      ps: PlatformService,
      gls: GamertagListService
    });

    function add() {
      vm.gls.addGamertag(vm.gamertag, vm.ps.active)
        .then(function() {
          vm.gamertag = "";
        });
    }
  }
})();