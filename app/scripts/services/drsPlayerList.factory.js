import angular from 'angular';

angular
  .module('drsApp')
  .factory('PlayerListService', PlayerListService);

PlayerListService.$inject = ['$q', '$translate', 'BungieLookupService', 'Constants', 'UtilsService'];

function PlayerListService($q, $translate, BungieLookupService, Constants, UtilsService) {
  const service = {
    addGroup: addGroup,
    addPlayer: addPlayer,
    players: []
    // removePlayer: removePlayer
  };
  return service;

  function addGroup(player, platform, promise) {
    const p = $q.defer();

    const entry = { player: player, platform: platform, loading: true, error: false, group: true };
    service.players.push(entry);

    promise.then(function success() {
      entry.loading = false;

      p.resolve();
    }, function failure(response) {
      entry.errorString = response;
      entry.error = true;
      entry.loading = false;

      p.reject(response);
    });

    return p.promise;
  }

  function addPlayer(player, platform) {
    player = UtilsService.sanitizeInput(player);
    if (UtilsService.isUndefinedOrNullOrEmpty(player)) {
      return $q.reject("Gamertag or PSN Id input is invalid");
    }

    platform = UtilsService.sanitizeInput(platform);
    if (UtilsService.isUndefinedOrNullOrEmpty(platform)) {
      return $q.reject("Platform is invalid");
    }

    const entry = { player: player, platform: platform, loading: true, error: false, group: false };
    service.players.push(entry);

    // do the async stuff
    return BungieLookupService.lookup(entry)
      .then(function success(response) {
        entry.stats = response;
        buildLinks(entry);
        parseStats(entry);
        entry.loading = false;

        return $q.resolve();
      }, function failure(response) {
        entry.errorString = response;
        entry.error = true;
        entry.loading = false;

        return $q.reject(response);
      });
  }

  function buildLinks(entry) {
    function buildDestinyStatusUrl() {
      // http://destinystatus.com/psn/<player>
      // http://destinystatus.com/xbl/<player>
      const alt = $translate.instant('Links.DestinyStatus.Alt');
      const text = $translate.instant('Links.DestinyStatus.Text');
      return "<a href='http://destinystatus.com/" +
        (entry.platform === Constants.platforms[0] ? "psn" : "xbl") + "/" + entry.player +
        "' target='_blank' alt='" + alt + "'>" + text + "</a>";
    }
    function buildDestinyTrackerUrl() {
      // http://destinytracker.com/destiny/overview/ps/<player>
      // http://destinytracker.com/destiny/overview/xbox/<player>
      const alt = $translate.instant('Links.DestinyTracker.Alt');
      const text = $translate.instant('Links.DestinyTracker.Text');
      return "<a href='http://destinytracker.com/destiny/overview/" +
        (entry.platform === Constants.platforms[0] ? "ps" : "xbox") + "/" + entry.player +
        "' target='_blank' alt='" + alt + "'>" + text + "</a>";
    }

    const urls = {};
    urls.destinyStatus = buildDestinyStatusUrl();
    urls.destinyTracker = buildDestinyTrackerUrl();
    entry.urls = urls;
  }

  function parseStats(entry) {
    function buildStats(start) {
      const stats = {};
      let i = start;
      stats.nm = entry.stats[Constants.raids[i++]] || 0;
      stats.hm = entry.stats[Constants.raids[i++]] || 0;
      // non-featured + featured. They have different hashes.
      stats[390] = (entry.stats[Constants.raids[i++]] || 0) + (entry.stats[Constants.raids[i++]] || 0);
      stats.total = stats.nm + stats.hm + stats[390];
      return stats;
    }

    entry.ce = buildStats(0);
    entry.vog = buildStats(4);
    entry.kf = buildStats(8);
    entry.wotm = buildStats(12);
  }

  // function removePlayer(player, platform) {
    // console.log("[drs] todo");
  // }
}