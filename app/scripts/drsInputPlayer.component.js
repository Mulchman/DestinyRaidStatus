import template from './drsInputPlayer.template.html';

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
  template: template
};