function InputPlayerCtrl($rootScope, Constants, InputMatcherService, PlayerListService, SettingsService) {
  'ngInject';

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

    add();
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

export const InputPlayerComponent = {
  controller: InputPlayerCtrl,
  template: `
    <span>
      <div id="platform-toggle">
        <p translate="{{'PlayStation.Service'}}"></p>
        <label class="switch">
          <input ng-model="$ctrl.platform" ng-change="$ctrl.toggle($ctrl.platform)" type="checkbox">
          <div class="slider round"></div>
        </label>
        <p translate="{{'Xbox.Service'}}"></p>
      </div>
      <input id="gamer-tag" type="text" ng-model="$ctrl.player" ng-keyup="$ctrl.keyup($event)" translate-attr="{placeholder: ($ctrl.platform ? 'Xbox.Player' : 'PlayStation.Player')}" maxlength="64" ng-trim="false">
      <span id="submit" ng-click="$ctrl.run()"><i class="fa fa-search"></i></span>
    </span>
  `
};