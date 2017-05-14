export function The100Ctrl($routeParams, $timeout, PlayerListService, The100Service, UtilsService) {
  'ngInject';

  // const vm = this;

  function preLoad(gameId) {
    $timeout(function() {
      if (UtilsService.isUndefinedOrNullOrEmpty(gameId)) {
        return;
      }

      The100Service.scrapePlayers(gameId)
        .then(function(platformAndPlayers) {
          const platform = platformAndPlayers.platform;
          const players = platformAndPlayers.players;
          players.forEach((player) => {
            PlayerListService.addPlayer(player, platform);
          });
        })
        .catch(function(error) {
          console.log("Error scraping the100.io game %o: %o", gameId, error);
        });
    });
  }

  preLoad($routeParams.gameId);
}