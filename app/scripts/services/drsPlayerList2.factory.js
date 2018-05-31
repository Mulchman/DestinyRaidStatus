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
    entry.memberships.forEach(function(m) {
      if (m.existsOnPlatform) {
        const platform = Constants.platformsLookup[m.type];
        const alias = {
          name: m.name,
          platform: platform,
          urls: {
            destinyStatus: buildDestinyStatusUrl(platform, m.name),
            destinyTracker: buildDestinyTrackerUrl(platform, m.name)
          }
        };
        entry.aliases.push(alias);
      }
    });
  }

  function buildDestinyStatusUrl(platform, name) {
    // http://destinystatus.com/pc/<player>
    // http://destinystatus.com/psn/<player>
    // http://destinystatus.com/xbl/<player>
    const alt = $translate.instant('Links.DestinyStatus.Alt');
    const text = $translate.instant('Links.DestinyStatus.Text');
    return "<a href='http://destinystatus.com/" +
      platform.toLowerCase() + "/" + name.replace('#', '%23') +
      "' target='_blank' alt='" + alt + "'>" + text + "</a>";
  }

  function buildDestinyTrackerUrl(platform, name) {
    // for all of these, '#' and ' ' get replaced by '-'
    // https://destinytracker.com/d2/profile/pc/<player>
    // https://destinytracker.com/d2/profile/psn/<player>
    // https://destinytracker.com/d2/profile/xbl/<player>
    const alt = $translate.instant('Links.DestinyTracker.Alt');
    const text = $translate.instant('Links.DestinyTracker.Text');
    return "<a href='http://destinytracker.com/d2/profile/" +
      platform.toLowerCase() + "/" + name.replace(' ', '-').replace('#', '-') +
      "' target='_blank' alt='" + alt + "'>" + text + "</a>";
  }

  function findParent(group) {
    return _.find(service.players, (entry) => { return (group && entry.group) ? (entry.group.id === group.id) : false; });
  }

  function parseStatsD2(entry) {
    entry.l = { nm: 0, g: 0, pm: 0, total: 0 };
    entry.eow = { nm: 0, g: 0, pm: 0, total: 0 };
    entry.sos = { nm: 0, g: 0, pm: 0, total: 0 };
    let offset = 0;

    // caclulate Leviathan normal mode
    for (let i = 0; i < 6; i++) {
      const hash = Constants.raidsD2[i + offset];
      entry.l.nm += (entry.stats[hash] || 0);
    }
    offset += 6;

    // caclulate Leviathan guided mode
    for (let i = 0; i < 6; i++) {
      const hash = Constants.raidsD2[i + offset];
      entry.l.nm += (entry.stats[hash] || 0);
    }
    offset += 6;

    // calculate Leviathan prestige mode
    for (let i = 0; i < 6; i++) {
      const hash = Constants.raidsD2[i + offset];
      entry.l.pm += (entry.stats[hash] || 0);
    }
    offset += 6;

    entry.l.total = entry.l.nm +  entry.l.g + entry.l.pm;

    // caclculate Eater of Worlds normal mode
    for (let i = 0; i < 1; i++) {
      const hash = Constants.raidsD2[i + offset];
      entry.eow.nm += (entry.stats[hash] || 0);
    }
    offset += 1;

    // caclculate Eater of Worlds guided mode
    for (let i = 0; i < 1; i++) {
      const hash = Constants.raidsD2[i + offset];
      entry.eow.nm += (entry.stats[hash] || 0);
    }
    offset += 1;

    // caclculate Eater of Worlds prestige mode
    for (let i = 0; i < 1; i++) {
      const hash = Constants.raidsD2[i + offset];
      entry.eow.pm += (entry.stats[hash] || 0);
    }
    offset += 1;

    entry.eow.total = entry.eow.nm +  entry.eow.g + entry.eow.pm;

    // caclculate Spire of Stars normal mode
    for (let i = 0; i < 1; i++) {
      const hash = Constants.raidsD2[i + offset];
      entry.sos.nm += (entry.stats[hash] || 0);
    }
    offset += 1;

    // caclculate Spire of Stars guided mode
    for (let i = 0; i < 1; i++) {
      const hash = Constants.raidsD2[i + offset];
      entry.sos.nm += (entry.stats[hash] || 0);
    }
    offset += 1;

    // caclculate Spire of Stars prestige mode
    for (let i = 0; i < 1; i++) {
      const hash = Constants.raidsD2[i + offset];
      entry.sos.pm += (entry.stats[hash] || 0);
    }
    offset += 1;

    entry.sos.total = entry.sos.nm +  entry.sos.g + entry.sos.pm;
  }

  function newEntry(player, groupId) {
    const entry = {
      aliases: [],
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