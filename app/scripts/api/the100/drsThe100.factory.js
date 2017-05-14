import _ from 'underscore';

export function The100Service($http, $q, Constants) {
  'ngInject';

  const endpoint = "https://api.destinyraidstatus.com/the100/scrape.php";
  const service = {
    scrapePlayers: scrapePlayers,
  };
  return service;

  function scrapePlayers(gameId) {
    return $q.when({
      method: 'GET',
      url: endpoint,
      params: {
        game: gameId
      }
    })
      .then($http)
      .then(function(response) {
        if (response.data.error) {
          return $q.reject(response.data.error);
        }

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