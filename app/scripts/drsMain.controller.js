import angular from 'angular';

angular
  .module('drsApp')
  .controller('MainCtrl', MainCtrl);

MainCtrl.$inject = ['$routeParams', '$timeout', 'Constants', 'PlayerListService', 'UtilsService'];

function MainCtrl($routeParams, $timeout, Constants, PlayerListService, UtilsService) {
  // const vm = this;

  function preLoad(platform, players) {
    $timeout(function() {
      if (UtilsService.isUndefinedOrNullOrEmpty(platform) ||
        UtilsService.isUndefinedOrNullOrEmpty(players) ||
        (Constants.platforms.indexOf(platform.toUpperCase()) === -1)) {
        return;
      }

      platform = platform.toUpperCase();
      players = players.split('/');
      for (let i = 0; i < players.length; i++) {
        if (UtilsService.isUndefinedOrNullOrEmpty(players[i])) {
          continue;
        }

        PlayerListService.addPlayer(players[i], platform);
      }
    });
  }

  preLoad($routeParams.platform, $routeParams.players);
}