import _ from 'lodash';

export function The100Service($http, $q, $translate, Constants) {
  'ngInject';

  const endpoint = "https://api.destinyraidstatus.com/the100/scrape2.php";
  const service = {
    scrapePlayers: scrapePlayers,
  };
  return service;

  function handleErrors(response) {
    if (response.status === -1) {
      return $q.reject(new Error($translate.instant('The100Service.NotConnected')));
    }
    if (response.status === 503 || response.status === 522 /* cloudflare */) {
      return $q.reject(new Error($translate.instant('The100Service.Down')));
    }
    if (response.status < 200 || response.status >= 400) {
      return $q.reject(new Error($translate.instant('The100Service.NetworkError', {
        status: response.status,
        statusText: response.statusText
      })));
    }

    // -1 - unknown error
    // 1 - success
    // 2 - unknown gameId: undefined
    // 4 - invalid gameId: not all numbers
    // 8 - unknown platform: couldn't parse platform from the page
    // 16 - no players: no players listed in the game
    const errorCode = response.data ? response.data.errorCode : -1;
    switch (errorCode) {
    case -1:
      return $q.reject(new Error($translate.instant('The100Service.Difficulties')));
    case 2:
      return $q.reject(new Error($translate.instant('The100Service.GameId')));
    case 4:
      return $q.reject(new Error($translate.instant('The100Service.GameId')));
    case 8:
      return $q.reject(new Error($translate.instant('The100Service.Platform')));
    case 16:
      return $q.reject(new Error($translate.instant('The100Service.NoPlayers')));
    }

    return response;
  }

  function scrapePlayers(gameId) {
    return $q.when({
      method: 'GET',
      url: endpoint,
      params: {
        game: gameId
      }
    })
      .then($http)
      .then(handleErrors, handleErrors)
      .then(function(response) {
        const platform = response.data.platform;
        const players = _.map(response.data.players, function(player) {
          const PSN = "PSN: ";
          const XBL = "XBL: ";
          const posPSN = player.indexOf(PSN);
          const posXBL = player.indexOf(XBL);

          if ((posPSN !== -1) && (posXBL !== -1)) {
            const onlyPSN = posPSN > posXBL
              ? player.substring(posPSN + PSN.length)
              : player.substring(PSN.length, posXBL);

            const onlyXBL = posXBL > posPSN
              ? player.substring(posXBL + XBL.length)
              : player.substring(XBL.length, posPSN);

            return platform === Constants.platforms[0] ? onlyPSN : onlyXBL;
          } else {
            return player;
          }
        });

        return { platform: platform, players: players };
      })
      .catch(function(error) {
        return $q.reject(error);
      });
  }
}