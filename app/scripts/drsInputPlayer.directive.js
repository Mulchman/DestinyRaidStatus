import angular from 'angular';

angular
  .module('drsApp')
  .directive('drsInputPlayer', InputPlayer);

function InputPlayer() {
  const directive = {
    restrict: 'E',
    templateUrl: require('app/scripts/drsInputPlayer.template.html'),
    scope: {},
    controller: InputPlayerCtrl,
    controllerAs: 'vm',
    bindToController: true
  };
  return directive;
}

InputPlayerCtrl.$inject = ['$rootScope', 'Constants', 'PlayerListService', 'SettingsService'];

function InputPlayerCtrl($rootScope, Constants, PlayerListService, SettingsService) {
  const vm = this;

  angular.extend(vm, {
    pl: PlayerListService,
    ss: SettingsService
  });

  vm.add = add;
  vm.player = "";
  vm.keyup = keyup;
  vm.toggle = toggle;
  vm.platform = getPlatformFromSettings();

  function add() {
    const platform = vm.platform ? Constants.platforms[1] : Constants.platforms[0];

    vm.pl.addPlayer(vm.player, platform)
      .then(function success() {
        vm.player = "";
      }, function failure(error) {
        console.log("PSN Id or Gamertag input failure: %o", error);
        vm.player = "";
      });
  }

  function getPlatformFromSettings() {
    // map XBox/PlayStation to true/false. Defaults to PlayStation.
    return SettingsService.platform === Constants.platforms[1];
  }

  function keyup(event) {
    if (event.keyCode === 13) {
      vm.add();
    }
  }

  function toggle(platform) {
    // map true/false to XBox/PlayStation.
    const active = platform ? Constants.platforms[1] : Constants.platforms[0];
    vm.ss.platform = active;
    vm.ss.save();
  }

  $rootScope.$on("drs-settings-loaded", function() {
    vm.platform = getPlatformFromSettings();
  });
}