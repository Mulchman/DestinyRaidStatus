import angular from 'angular';
import template from './drsPlayerList.D2.template.html';

function PlayerListD2Ctrl(PlayerListD2Service) {
  'ngInject';

  const vm = this;

  angular.extend(vm, {
    pls: PlayerListD2Service
  });
}

export const PlayerListD2Component = {
  controller: PlayerListD2Ctrl,
  template: template
};