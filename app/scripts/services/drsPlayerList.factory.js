import _ from 'lodash';

function PlayerListService($q, $translate, BungieLookupService, Constants, UtilsService) {
  'ngInject';

  const service = {
    startGroup: startGroup,
    endGroup: endGroup,
    addPlayer: addPlayer,
    players: []
    // removePlayer: removePlayer
  };
  return service;

  function startGroup(player, platform, id) {
    const p = $q.defer();

    if (UtilsService.isUndefinedOrNullOrEmpty(id)) {
      p.reject(new Error("Invalid group Id"));
      return p.promise;
    }

    const entry = newEntry(player, platform, id);
    service.players.push(entry);

    p.resolve(entry.group);
    return p.promise;
  }

  function endGroup(group, error) {
    const parent = findParent(group);
    if (!parent) {
      return $q.reject(new Error("Could not find group"));
    }

    if (error) {
      parent.errorString = error;
      parent.error = true;
    }

    parent.loading = false;

    return $q.resolve();
  }

  function addPlayer(player, platform, group) {
    player = UtilsService.sanitizeInput(player);
    if (UtilsService.isUndefinedOrNullOrEmpty(player)) {
      return $q.reject(new Error("Gamertag or PSN Id input is invalid"));
    }

    platform = UtilsService.sanitizeInput(platform);
    if (UtilsService.isUndefinedOrNullOrEmpty(platform)) {
      return $q.reject(new Error("Platform is invalid"));
    }

    const entry = newEntry(player, platform, group ? group.id : null);
    if (group) {
      const parent = findParent(group);
      if (!parent) {
        return $q.reject(new Error("Could not find group"));
      }
      parent.group.children.push(entry);
    } else {
      service.players.push(entry);
    }

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

  function findParent(group) {
    return _.find(service.players, (entry) => { return (group && entry.group) ? (entry.group.id === group.id) : false; });
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

  function newEntry(player, platform, groupId) {
    const entry = {
      player: player,
      platform: platform,
      loading: true,
      error: false
    };

    if (groupId !== null) {
      entry.group = {};
      entry.group.id = groupId;
      entry.group.children = [];
    }

    return entry;
  }

  // function removePlayer(player, platform) {
    // console.log("[drs] todo");
  // }
}

export default PlayerListService;