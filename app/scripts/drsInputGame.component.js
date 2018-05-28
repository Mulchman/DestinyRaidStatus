import template from './drsInputGame.template.html';

function InputGameCtrl($rootScope, Constants, SettingsService) {
  'ngInject';

  const vm = this;

  vm.game = getGameFromSettings();
  vm.toggle = toggle;

  function getGameFromSettings() {
    // map Destiny1/Destiny2 to true/false. Defaults to Destiny2.
    return SettingsService.game === Constants.games[1];
  }

  function toggle(game) {
    // map true/false to Destiny1/Destiny2
    const active = game ? Constants.games[1] : Constants.games[0];
    SettingsService.game = active;
    SettingsService.save();
  }

  $rootScope.$on("drs-settings-loaded", function() {
    vm.game = getGameFromSettings();
  });
}

export const InputGameComponent = {
  controller: InputGameCtrl,
  template: template
};