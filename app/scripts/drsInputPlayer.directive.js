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

InputPlayerCtrl.$inject = ['$rootScope', 'Constants', 'PlayerListService', 'SettingsService', 'The100Service'];

function InputPlayerCtrl($rootScope, Constants, PlayerListService, SettingsService, The100Service) {
  const vm = this;

  angular.extend(vm, {
    pl: PlayerListService,
    ss: SettingsService,
    t100s: The100Service
  });

  vm.run = run;
  vm.player = "";
  vm.keyup = keyup;
  vm.toggle = toggle;
  vm.platform = getPlatformFromSettings();

    function run() {
        var input = vm.player;

        var match;
        match = input.match(/the100\.io\/game\/([0-9]+)$/)

        if (match === null) {
            return add();
        } else {
            return the100(match[1]);
        }
    }

    function the100(gameId) {

        const platform = vm.platform ? Constants.platforms[1] : Constants.platforms[0];

        vm.t100s.scrapeGamertags(gameId)
            .then((function (tags) {
                tags.forEach(t => {
                    vm.ls.addPlayer(t, platform)
                })
                vm.player = "";
            }))
    }

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
      vm.run();
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