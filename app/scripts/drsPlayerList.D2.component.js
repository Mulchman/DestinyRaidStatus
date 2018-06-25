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
    const copyFrom = document.createElement('textarea');
    copyFrom.textContent = alias;

    const body = document.getElementsByTagName('body')[0];
    body.appendChild(copyFrom);
    copyFrom.select();
    document.execCommand('copy');
    body.removeChild(copyFrom);
  }
}

export const PlayerListD2Component = {
  controller: PlayerListD2Ctrl,
  template: template
};