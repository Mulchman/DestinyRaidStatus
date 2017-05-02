import angular from 'angular';

angular
  .module('drsApp')
  .directive('drsInputGamertag', InputGamertag);

function InputGamertag($timeout) {
  const directive = {
    restrict: 'E',
    templateUrl: require('app/scripts/drsInputGamertag.template.html'),
    scope: {},
    controller: InputGamertagCtrl,
    controllerAs: 'vm',
    bindToController: true,
    link: Link
  };
  return directive;

  function Link(scope) {
    /*const vm = scope.vm;
    const element = angular.element("#platform");

    vm.togglePlatform = togglePlatform;

    //console.log("[drs] link: %o", angular.element("#platform"));

    $timeout(function() {
      console.log("[drs] removing");
      element.removeClass("md-checked");
    });


    function togglePlatform() {
      $timeout(function() {
        console.log("[drs] removing");
        element.removeClass("md-checked");
      });
    }*/
  }
}

function InputGamertagCtrl(GamertagListService, PlatformService) {
  const vm = this;

  vm.add = add;
  vm.gamertag = "";
  vm.keyup = keyup;

  angular.extend(vm, {
    ps: PlatformService,
    gls: GamertagListService
  });

  function add() {
    vm.gls.addGamertag(vm.gamertag, vm.ps.active)
      .then(function() {
        vm.gamertag = "";
      });
  }

  function keyup(event) {
    if (event.keyCode === 13) {
      vm.add();
    }
  }
}