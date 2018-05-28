import template from './drsHeader.template.html';

function HeaderCtrl(Constants, SettingsService) {
  'ngInject';

  const vm = this;

  vm.isDestiny1 = isDestiny1;
  vm.isDestiny2 = isDestiny2;

  function isDestiny1() {
    return SettingsService.game === Constants.games[0];
  }

  function isDestiny2() {
    return SettingsService.game === Constants.games[1];
  }
}

export const HeaderComponent = {
  controller: HeaderCtrl,
  template: template
};