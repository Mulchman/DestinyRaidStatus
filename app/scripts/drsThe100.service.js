import angular from 'angular';
import _ from 'underscore';

angular
    .module('drsApp')
    .factory('The100Service', The100Service);

The100Service.$inject = ['$http', '$q'];

function The100Service($http, $q) {
  const endpoint = "http://api.destinyraidstatus.com/the100/scrape.php";
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
        const players = _.pluck(response.data, 'player');
        //console.log("[drs] response: %o, player: %o", response, players);
        return players;
      })
      .catch(function(error) {
        return $q.reject(error);
      });
  }
}