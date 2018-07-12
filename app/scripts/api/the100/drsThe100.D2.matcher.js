import angular from 'angular';

export function The100D2Matcher($q, $translate, PlayerListD2Service, The100D2Service, uuid2) {
  'ngInject';

  const service = {
    description: "Matches the100.io game URLs",
    name: "The100",
    runFn: runFn,
    testFn: testFn
  };
  return service;

  function reflect(promise) {
    return promise.then(function() {}, function() {});
  }

  function runFn(player, platform, userdata) {
    const gameId = userdata.match[1];
    if (angular.isUndefined(gameId) || gameId === null || gameId.trim() === '') {
      return $q.reject(new Error($translate.instant('The100D2Service.GameId')));
    }

    const endpoint = "https://www.the100.io/gaming_sessions/" + gameId;
    const url = "<a href='" + endpoint + "' target='_blank'>" + gameId + "</a>";

    return PlayerListD2Service.startGroup(url, service.name, uuid2.newguid())
      .then(function(group) {
        group.gameId = gameId;

        return scrapePlayers(group)
          .then(PlayerListD2Service.endGroup)
          .catch(function(error) {
            PlayerListD2Service.endGroup(group, error);
          });
      });
  }

  function scrapePlayers(group) {
    return The100D2Service.scrapePlayers(group.gameId)
      .then(function(response) {
        const players = response.players;

        const promises = [];
        players.forEach((player) => promises.push(PlayerListD2Service.addPlayer(player, group)));

        // we don't want a single error stopping the whole chain. The action queue doesn't work that way, either.
        return $q.all(promises.map(reflect)).then(function() {
          return $q.resolve(group);
        });
      });
  }

  function testFn(player, platform, userdata) {
    userdata.match = player.match(/the100\.io\/gaming_sessions\/([0-9]+)$/);
    if (userdata.match === null) {
      userdata.match = player.match(/the100\.io\/game\/([0-9]+)$/);
    }
    return userdata.match !== null;
  }
}