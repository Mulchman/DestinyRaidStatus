import angular from 'angular';
import template from './drsPlayerList.D2.template.html';

function PlayerListD2Ctrl(PlayerListD2Service) {
  'ngInject';

  const vm = this;
  vm.copyClicked = copyClicked;

  angular.extend(vm, {
    pls: PlayerListD2Service
  });

  function copyClicked(alias) {
    // https://stackoverflow.com/a/43483323
    function handler(event) {
      event.clipboardData.setData('text/plain', alias);
      event.preventDefault();
      document.removeEventListener('copy', handler, true);
    }

    document.addEventListener('copy', handler, true);
    document.execCommand('copy');
  }
}

export const PlayerListD2Component = {
  controller: PlayerListD2Ctrl,
  template: template
};