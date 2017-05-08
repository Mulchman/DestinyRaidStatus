import angular from 'angular';

angular
  .module('drsApp')
  .directive('drsInputPlayer', InputPlayer);

function InputPlayer() {
  const directive = {
    restrict: 'E',
    scope: {},
    controller: InputPlayerCtrl,
    controllerAs: 'vm',
    bindToController: true,
    template: `
      <span>
        <div id="platform-toggle">
          <p translate="{{'PlayStation.Service'}}"></p>
          <label class="switch">
            <input ng-model="vm.platform" ng-change="vm.toggle(vm.platform)" type="checkbox">
            <div class="slider round"></div>
          </label>
          <p translate="{{'Xbox.Service'}}"></p>
        </div>
        <input id="gamer-tag" type="text" ng-model="vm.player" ng-keyup="vm.keyup($event)" translate-attr="{placeholder: (vm.platform ? 'Xbox.Player' : 'PlayStation.Player')}" maxlength="64" ng-trim="false">
        <span id="submit" ng-click="vm.run()"><i class="fa fa-search"></i></span>
      </span>
    `
  };
  return directive;
}

InputPlayerCtrl.$inject = ['$rootScope', 'Constants', 'PlayerListService', 'SettingsService', 'The100Service'];

function InputPlayerCtrl($rootScope, Constants, PlayerListService, SettingsService, The100Service) {
  const vm = this;

  angular.extend(vm, {
    pls: PlayerListService,
    ss: SettingsService,
    t100s: The100Service
  });

  vm.keyup = keyup;
  vm.platform = getPlatformFromSettings();
  vm.player = "";
  vm.run = run;
  vm.toggle = toggle;

  function add() {
    const platform = vm.platform ? Constants.platforms[1] : Constants.platforms[0];

    vm.pls.addPlayer(vm.player, platform)
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

  function run() {
    const input = vm.player;

    const match = input.match(/the100\.io\/game\/([0-9]+)$/);
    if (match === null) {
      return add();
    } else {
      return the100(match[1]);
    }
  }

  function the100(gameId) {
    vm.t100s.scrapePlayers(gameId)
      .then(function(platformAndPlayers) {
        const platform = platformAndPlayers.platform;
        const players = platformAndPlayers.players;
        players.forEach((player) => {
          vm.pls.addPlayer(player, platform);
        });
        vm.player = "";
      })
      .catch(function(error) {
        vm.player = "";
        console.log("Error scraping the100.io game %o: %o", gameId, error);
      });
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
