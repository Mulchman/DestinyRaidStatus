import angular from 'angular';

export function The100Matcher($q, $translate, PlayerListService, The100Service) {
  'ngInject';

  const service = {
    description: "Matches the100.io game URLs",
    name: "The100",
    runFn: runFn,
    testFn: testFn
  };
  return service;

  function runFn(player, platform, userdata) {
    const p = $q.defer();

    const gameId = userdata.match[1];
    if (angular.isUndefined(gameId) || gameId === null || gameId.trim() === '') {
      p.reject(new Error($translate.instant('The100Service.GameId')));
      return p.promise;
    }

    The100Service.scrapePlayers(gameId)
      .then(function (platformAndPlayers) {
        const platform = platformAndPlayers.platform;
        const players = platformAndPlayers.players;
        players.forEach((player) => {
          PlayerListService.addPlayer(player, platform);
        });
      })
      .catch(function(error) {
        console.log("Error scraping the100.io game %o: %o", gameId, error);
      });

    p.resolve();

    return p.promise;
  }

  function testFn(player, platform, userdata) {
    userdata.match = player.match(/the100\.io\/game\/([0-9]+)$/);
    return userdata.match !== null;
  }
}