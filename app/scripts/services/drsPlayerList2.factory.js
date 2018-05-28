import _ from 'lodash';

function PlayerList2Service($q, $translate, Bungie2LookupService, Constants, SettingsService, UtilsService) {
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

  function addPlayer(player, group) {
    player = UtilsService.sanitizeInput(player);
    if (UtilsService.isUndefinedOrNullOrEmpty(player)) {
      return $q.reject(new Error("Gamertag or PSN Id or Battle.net ID input is invalid"));
    }

    const entry = newEntry(player, group ? group.id : null);
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
    return Bungie2LookupService.lookup(entry)
      .then(function success(response) {
        entry.memberships = response.memberships;
        entry.stats = response.stats;
        buildAliases(entry);
        buildLinksD2(entry);
        parseStatsD2(entry);
        entry.loading = false;

        return $q.resolve();
      }, function failure(response) {
        entry.errorString = response;
        entry.error = true;
        entry.loading = false;

        return $q.reject(response);
      });
  }

  function buildAliases(entry) {
    let aliases = '';
    let first = true;
    entry.memberships.forEach(function(m) {
      if (m.existsOnPlatform) {
        aliases += ((first ? '' : ', ') + Constants.platformsLookup[m.type] + ': ' + m.name);
        first = false;
      }
    });
    if (aliases !== '') {
      entry.aliases = aliases;
    }
  }

  function buildLinksD2(entry) {
    /*
    function buildDestinyStatusUrlD2() {
      // http://destinystatus.com/psn/<player>
      // http://destinystatus.com/xbl/<player>
      const alt = $translate.instant('Links.DestinyStatus.Alt');
      const text = $translate.instant('Links.DestinyStatus.Text');
      return "<a href='http://destinystatus.com/" +
        (entry.platform === Constants.platforms[0] ? "psn" : "xbl") + "/" + entry.player +
        "' target='_blank' alt='" + alt + "'>" + text + "</a>";
    }
    function buildDestinyTrackerUrlD2() {
      // http://destinytracker.com/destiny/overview/ps/<player>
      // http://destinytracker.com/destiny/overview/xbox/<player>
      const alt = $translate.instant('Links.DestinyTracker.Alt');
      const text = $translate.instant('Links.DestinyTracker.Text');
      return "<a href='http://destinytracker.com/destiny/overview/" +
        (entry.platform === Constants.platforms[0] ? "ps" : "xbox") + "/" + entry.player +
        "' target='_blank' alt='" + alt + "'>" + text + "</a>";
    }
    */

    const urls = {};
    // urls.destinyStatus = buildDestinyStatusUrlD2();
    // urls.destinyTracker = buildDestinyTrackerUrlD2();
    entry.urls = urls;
  }

  function findParent(group) {
    return _.find(service.players, (entry) => { return (group && entry.group) ? (entry.group.id === group.id) : false; });
  }

  function parseStatsD2(entry) {
    entry.l = { nm: 0, pm: 0, total: 0 };
    entry.eow = { nm: 0, pm: 0, total: 0 };
    entry.sos = { nm: 0, pm: 0, total: 0 };
    let offset = 0;

    // caclulate Leviathan normal mode
    for (let i = 0; i < 12; i++) {
      const hash = Constants.raidsD2[i + offset];
      entry.l.nm += (entry.stats[hash] || 0);
    }
    offset += 12;

    // calculate Leviathan prestige mode
    for (let i = 0; i < 6; i++) {
      const hash = Constants.raidsD2[i + offset];
      entry.l.pm += (entry.stats[hash] || 0);
    }
    offset += 6;

    entry.l.total = entry.l.nm + entry.l.pm;

    // caclculate Eater of Worlds normal mode
    for (let i = 0; i < 2; i++) {
      const hash = Constants.raidsD2[i + offset];
      entry.eow.nm += (entry.stats[hash] || 0);
    }
    offset += 2;

    // caclculate Eater of Worlds prestige mode
    for (let i = 0; i < 1; i++) {
      const hash = Constants.raidsD2[i + offset];
      entry.eow.pm += (entry.stats[hash] || 0);
    }
    offset += 1;

    entry.eow.total = entry.eow.nm + entry.eow.pm;

    // caclculate Spire of Stars normal mode
    for (let i = 0; i < 2; i++) {
      const hash = Constants.raidsD2[i + offset];
      entry.sos.nm += (entry.stats[hash] || 0);
    }
    offset += 2;

    // caclculate Spire of Stars prestige mode
    for (let i = 0; i < 1; i++) {
      const hash = Constants.raidsD2[i + offset];
      entry.sos.pm += (entry.stats[hash] || 0);
    }
    offset += 1;

    entry.sos.total = entry.sos.nm + entry.sos.pm;
  }

  function newEntry(player, groupId) {
    const entry = {
      aliases: player,
      error: false,
      loading: true,
      memberships: null,
      player: player
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

export default PlayerList2Service;