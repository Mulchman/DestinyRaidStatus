import angular from 'angular';

angular
  .module('drsApp')
  .factory('GamertagListService', GamertagListService);

function GamertagListService($q, BungieLookupService, RaidService, UtilsService) {
  const service = {
    addGamertag: addGamertag,
    gamertags: [],
    removeGamertag: removeGamertag
  };
  return service;

  function addGamertag(gamertag, platform) {
    let p = $q.defer();

    let entry = {gamertag: gamertag, platform: platform, loading: true, error: false};
    service.gamertags.push(entry);

    // do the async stuff
    BungieLookupService.lookup(entry)
      .then(function success(response) {
        entry.stats = response;
        parseStats(entry);
        entry.loading = false;
      }, function failure(response) {
        entry.errorString = response;
        entry.error = true;
        entry.loading = false;
      });

    p.resolve();

    return p.promise;
  }

  function parseStats(entry) {

    function buildStats(start) {
      const stats = {};
      let i = start;
      stats.nm = entry.stats[RaidService.raids[i++]] || 0;
      stats.hm = entry.stats[RaidService.raids[i++]] || 0;
      stats[390] = entry.stats[RaidService.raids[i++]] || 0;
      stats.total = stats.nm + stats.hm + stats[390];
      return stats;
    }

    entry.ce = buildStats(0);
    entry.vog = buildStats(3);
    entry.kf = buildStats(6);
    entry.wotm = buildStats(9);
  }

  function removeGamertag(gamertag, platform) {
    console.log("[drs] todo");
  }
}