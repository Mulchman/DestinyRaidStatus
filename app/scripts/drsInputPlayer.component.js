import template from './drsInputPlayer.template.html';

function InputPlayerCtrl($rootScope, Constants, InputPlayerService, SettingsService) {
  'ngInject';

  const vm = this;

  vm.keyup = keyup;
  vm.platform = getPlatformFromSettings();
  vm.player = "";
  vm.run = run;
  vm.toggle = toggle;

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

    InputPlayerService.add(player, platform);
    vm.player = "";
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