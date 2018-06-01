import _ from 'lodash';

export function The100D2Service($http, $q, $translate) {
  'ngInject';

  const endpoint = "https://api.destinyraidstatus.com/the100/scrape3.php";
  const service = {
    scrapePlayers: scrapePlayers,
  };
  return service;

  function handleErrors(response) {
    function createError(message) {
      const error = new Error(message);
      error.status = response.status;
      error.statusText = response.statusText;
      error.data = {
        ErrorCode: response.data ? response.data.ErrorCode : -1,
        ErrorStatus: response.data ? response.data.ErrorStatus : ''
      };
      return error;
    }

    if (response.status === -1) {
      return $q.reject(createError($translate.instant('The100Service.NotConnected')));
    }
    if (response.status === 503 || response.status === 522 /* cloudflare */) {
      return $q.reject(createError($translate.instant('The100Service.Down')));
    }
    if (response.status < 200 || response.status >= 400) {
      return $q.reject(createError($translate.instant('The100Service.NetworkError')));
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
      return $q.reject(createError($translate.instant('The100Service.Difficulties')));
    case 2:
      return $q.reject(createError($translate.instant('The100Service.GameId')));
    case 4:
      return $q.reject(createError($translate.instant('The100Service.GameId')));
    case 8:
      return $q.reject(createError($translate.instant('The100Service.Platform')));
    case 16:
      return $q.reject(createError($translate.instant('The100Service.NoPlayers')));
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
        const players = _.map(response.data.players, function(player) {
          // Prefer an alias as it tends to be more correct, especially for PC where the # is needed
          if (player.aliases.PSN) {
            return player.aliases.PSN;
          }
          if (player.aliases.XBL) {
            return player.aliases.XBL;
          }
          if (player.aliases.PC) {
            return player.aliases.PC;
          }
          return player.name;
        });

        return { players: players };
      })
      .catch(function(error) {
        return $q.reject(error);
      });
  }
}