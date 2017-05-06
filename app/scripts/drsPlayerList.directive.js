import angular from 'angular';

angular
  .module('drsApp')
  .directive('drsPlayerList', PlayerList);

function PlayerList() {
  const directive = {
    restrict: 'E',
    templateUrl: require('app/scripts/drsPlayerList.template.html'),
    scope: {},
    controller: PlayerListCtrl,
    controllerAs: 'vm',
    bindToController: true
  };
  return directive;
}

PlayerListCtrl.$inject = ['PlayerListService'];

function PlayerListCtrl(PlayerListService) {
  const vm = this;

  angular.extend(vm, {
    pl: PlayerListService
  });
}