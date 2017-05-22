import angular from 'angular';
import template from './drsPlayerList.template.html';

function PlayerListCtrl(PlayerListService) {
  'ngInject';

  const vm = this;

  angular.extend(vm, {
    pls: PlayerListService
  });
}

export const PlayerListComponent = {
  controller: PlayerListCtrl,
  template: template
};