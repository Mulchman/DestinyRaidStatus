function MainController($routeParams, $timeout, Constants, PlayerListService, UtilsService) {
  'ngInject';

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

        PlayerListService.addPlayer(players[i], platform)
          .catch(function() {
            // console.log("PSN Id or Gamertag input failure: %o", error);
          });
      }
    });
  }

  // TODO: figure out what to do now that there are 2 games supported and parameters are different
  preLoad($routeParams.platform, $routeParams.players);
}

export default MainController;