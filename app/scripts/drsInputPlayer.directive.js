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

InputPlayerCtrl.$inject = ['$rootScope', 'Constants', 'InputMatcherService', 'PlayerListService', 'SettingsService'];

function InputPlayerCtrl($rootScope, Constants, InputMatcherService, PlayerListService, SettingsService) {
  const vm = this;

  vm.keyup = keyup;
  vm.platform = getPlatformFromSettings();
  vm.player = "";
  vm.run = run;
  vm.toggle = toggle;

  function add() {
    const platform = vm.platform ? Constants.platforms[1] : Constants.platforms[0];

    PlayerListService.addPlayer(vm.player, platform)
      .catch(function() {
        // console.log("PSN Id or Gamertag input failure: %o", error);
      });

    vm.player = "";
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
    const player = vm.player;
    const platform = vm.platform ? Constants.platforms[1] : Constants.platforms[0];

    const matcherFns = InputMatcherService.getMatcherFns();
    for (let i = 0; i < matcherFns.length; i++) {
      const matcher = matcherFns[i];

      const userdata = {};
      if (matcher.testFn(player, platform, userdata)) {
        vm.player = "";

        matcher.runFn(player, platform, userdata)
          .catch(function() {
            // console.log("PSN Id or Gamertag input failure with %o: %o", matcher.name, error);
          });

        return;
      }
    }

    return add();
  }

  function toggle(platform) {
    // map true/false to XBox/PlayStation.
    const active = platform ? Constants.platforms[1] : Constants.platforms[0];
    SettingsService.platform = active;
    SettingsService.save();
  }

  $rootScope.$on("drs-settings-loaded", function() {
    vm.platform = getPlatformFromSettings();
  });
}
