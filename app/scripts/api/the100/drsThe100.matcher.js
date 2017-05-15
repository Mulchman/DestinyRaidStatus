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

    const gameId = userdata.match[1];
    if (angular.isUndefined(gameId) || gameId === null || gameId.trim() === '') {
      return $q.reject(new Error($translate.instant('The100Service.GameId')));
    }

    const promise = The100Service.scrapePlayers(gameId)
      .then(function (platformAndPlayers) {
        const platform = platformAndPlayers.platform;
        const players = platformAndPlayers.players;

        const promises = [];
        players.forEach((player) => promises.push(PlayerListService.addPlayer(player, platform)));

        return $q.all(promises)
          .then(function() {
            return $q.resolve();
          });
      });

    const endpoint = "https://www.the100.io/game/" + gameId;
    const url = "<a href='" + endpoint + "' target='_blank'>" + gameId + "</a>";

    return PlayerListService.addGroup(url, service.name, promise);
  }

  function testFn(player, platform, userdata) {
    userdata.match = player.match(/the100\.io\/game\/([0-9]+)$/);
    return userdata.match !== null;
  }
}