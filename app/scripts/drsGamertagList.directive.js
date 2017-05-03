import angular from 'angular';

angular
  .module('drsApp')
  .directive('drsGamertagList', GamertagList);

function GamertagList() {
  const directive = {
    restrict: 'E',
    templateUrl: require('app/scripts/drsGamertagList.template.html'),
    scope: {},
    controller: GamertagListCtrl,
    controllerAs: 'vm',
    bindToController: true
  };
  return directive;
}

GamertagListCtrl.$inject = ['GamertagListService'];

function GamertagListCtrl(GamertagListService) {
  const vm = this;

  angular.extend(vm, {
    gls: GamertagListService
  });
}