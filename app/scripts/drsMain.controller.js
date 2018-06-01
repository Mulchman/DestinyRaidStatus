function MainController($rootScope, $routeParams, $timeout, Constants, PlayerListService, PlayerListD2Service, SettingsService, UtilsService) {
  'ngInject';

  // const vm = this;

  function preLoadDestiny1(platform, players) {
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

        PlayerListService.addPlayer(players[i], platform)
          .catch(function() {
            // console.log("PSN Id or Gamertag input failure: %o", error);
          });
      }
    });
  }

  function preLoadDestiny2(players) {
    players = players.split('/');
    for (let i = 0; i < players.length; i++) {
      if (UtilsService.isUndefinedOrNullOrEmpty(players[i])) {
        continue;
      }

      PlayerListD2Service.addPlayer(players[i])
          .catch(function() {
            // console.log("PSN Id or Gamertag or Battle.net ID input failure: %o", error);
          });
    }
  }

  $rootScope.$on("drs-settings-loaded", function() {
    if (SettingsService.game === Constants.games[0]) {
      preLoadDestiny1($routeParams.platform, $routeParams.players);
    } else if (SettingsService.game === Constants.games[1]) {
      preLoadDestiny2($routeParams.players);
    } else {
      console.log("Unknown game when attempting to preload");
    }
  });
}

export default MainController;