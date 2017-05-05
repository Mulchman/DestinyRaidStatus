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

InputGamertagCtrl.$inject = ['$rootScope', 'Constants', 'GamertagListService', 'SettingsService'];

function InputGamertagCtrl($rootScope, Constants, GamertagListService, SettingsService) {
  const vm = this;

  angular.extend(vm, {
    gls: GamertagListService,
    ss: SettingsService
  });

  vm.add = add;
  vm.gamertag = "";
  vm.keyup = keyup;
  vm.toggle = toggle;
  vm.platform = getPlatformFromSettings();

  function add() {
    vm.gls.addGamertag(vm.gamertag, vm.ps.active)
      .then(function success() {
        vm.gamertag = "";
      }, function failure(error) {
        console.log("Gamertag input failure: %o", error);
        vm.gamertag = "";
      });
  }

  function getPlatformFromSettings() {
    // map XBox/PlayStation to true/false. Defaults to PlayStation.
    return SettingsService.platform === Constants.platforms[1] ? true : false;
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