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

InputGamertagCtrl.$inject = ['GamertagListService', 'PlatformService', 'SettingsService'];

function InputGamertagCtrl(GamertagListService, PlatformService, SettingsService) {
  const vm = this;

  vm.add = add;
  vm.gamertag = "";
  vm.keyup = keyup;
  vm.toggle = toggle;

  angular.extend(vm, {
    ps: PlatformService,
    gls: GamertagListService,
    ss: SettingsService
  });

  function add() {
    vm.gls.addGamertag(vm.gamertag, vm.ps.active)
      .then(function success() {
        vm.gamertag = "";
      }, function failure(error) {
        console.log("Gamertag input failure: %o", error);
        vm.gamertag = "";
      });
  }

  function keyup(event) {
    if (event.keyCode === 13) {
      vm.add();
    }
  }

  function toggle(platform) {
    vm.ss.platform = platform;
    vm.ss.save();
  }
}