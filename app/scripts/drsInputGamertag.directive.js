import angular from 'angular';

angular
  .module('drsApp')
  .directive('drsInputGamertag', InputGamertag);

function InputGamertag() {
  const directive = {
    restrict: 'E',
    templateUrl: require('app/scripts/drsInputGamertag.template.html'),
    scope: {},
    controller: InputGamertagCtrl,
    controllerAs: 'vm',
    bindToController: true
  };
  return directive;
}

function InputGamertagCtrl(GamertagListService, PlatformService) {
  const vm = this;

  vm.add = add;
  vm.gamertag = "";
  vm.keyup = keyup;

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

  function keyup(event) {
    if (event.keyCode === 13) {
      vm.add();
    }
  }
}