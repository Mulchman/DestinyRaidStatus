import angular from 'angular';
import template from './drsPlayerList2.template.html';

function PlayerList2Ctrl(PlayerList2Service) {
  'ngInject';

  const vm = this;

  angular.extend(vm, {
    pls: PlayerList2Service
  });
}

export const PlayerList2Component = {
  controller: PlayerList2Ctrl,
  template: template
};