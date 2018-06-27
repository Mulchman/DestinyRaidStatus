import _ from 'lodash';

function BungieLookupD2Service($http, $q, $translate, Constants, QueueService) {
  'ngInject';

  const apiKey = $DRS_API_KEY;

  const lookup = QueueService.wrap(function(entry) {
    // 1) Look up the name the user gave via SearchDestinyPlayer
    // 2) Take that membership information and use it to find any other memberships (ie. other platform accounts)
    // 3) Combine all the memberships to find all characters
    // 4) Take all characters and find raid completions
    const data = {
      player: entry.player,
      bootstrap: { type: -1, id: null, name: entry.original }, /* starting point */
      memberships: null,
      stats: null
    };

    return getBootstrapData(data)
      .then(getAllMemberships)
      .then(function() {
        const promises = [
          getAllCharacterIds(data)
        ];
        return $q.all(promises)
          .then(function() {
            const promises = [
              getActivities(data)
            ];
            return $q.all(promises)
              .then(function(activities) {
                const onlyRaidActivities = _.reject(_.flatten(activities[0]), function(activity) {
                  return !_.includes(Constants.raidsD2, activity.activityHash);
                });

                data.stats = {};
                Constants.raidsD2.forEach(function(raidHash) {
                  data.stats[raidHash] = 0;
                  onlyRaidActivities.forEach(function(activity) {
                    if (activity.activityHash === raidHash) {
                      data.stats[raidHash] += activity.values.activityCompletions.basic.value;
                    }
                  });
                });

                return $q.resolve(data);
              });
          });
      })
      .catch(function(error) {
        return $q.reject(error);
      });
  });

  const service = {
    lookup: lookup
  };
  return service;

  function bungifyUrl(url) {
    return url;
  }

  function getActivities(data) {
    const explode = [];
    data.memberships.forEach(function(m) {
      if (m.existsOnPlatform) {
        m.characterIds.forEach(function(c) {
          explode.push({ type: m.type, id: m.id, cId: c });
        });
      }
    });

    const promises = explode.map(function(e) {
      return $q.when(getAggregateActivityStats(e.type, e.id, e.cId))
        .then($http)
        .then(handleErrors, handleErrors)
        .then(function(response) {
          // console.log("[DRS] [getActivities] response: %o", response);
          return response.data.Response.activities;
        });
    });

    function getAggregateActivityStats(membership, membershipId, characterId) {
      const url = getAggregateActivityStatsUrl(membership, membershipId, characterId);
      return {
        method: 'GET',
        url: url,
        headers: {
          'X-API-Key': apiKey
        }
      };
    }

    function getAggregateActivityStatsUrl(membership, membershipId, characterId) {
      return bungifyUrl('https://www.bungie.net/Platform/Destiny2/' + membership + '/Account/' + membershipId + '/Character/' + characterId + '/Stats/AggregateActivityStats/');
    }

    return $q.all(promises);
  }

  function getAllCharacterIds(data) {
    const promises = data.memberships.map(function(m) {
      return $q.when(getAllCharacterIdsHttp(m.type, m.id))
        .then($http)
        .then(handleErrors, handleErrors)
        .then(function(response) {
          // console.log("[DRS] [getAllCharacterIds] response: %o", response);
          m.existsOnPlatform = true;
          m.characterIds = _.map(response.data.Response.characters, 'characterId');
          return data;
        })
        .catch(function(error) {
          if (error.data.ErrorCode === 1601) {
            // ignore this error. they don't have a Destiny 2 character this platform.
            return data;
          } else {
            return $q.reject(error);
          }
        });
    });

    function getAllCharacterIdsHttp(type, id) {
      const url = makeUrl(type, id);
      return {
        method: 'GET',
        url: url,
        headers: {
          'X-API-Key': apiKey
        }
      };
    }

    function makeUrl(type, id) {
      return bungifyUrl('https://www.bungie.net/Platform/Destiny2/' + type + '/Account/' + id + '/Stats/');
    }

    return $q.all(promises);
  }

  function getAllMemberships(data) {
    function makeUrl() {
      return bungifyUrl('https://www.bungie.net/Platform/User/GetMembershipsById/' + data.bootstrap.id + '/' + data.bootstrap.type + '/');
    }

    const url = makeUrl();
    return $q.when({
      method: 'GET',
      url: url,
      headers: {
        'X-API-Key': apiKey
      }
    })
      .then($http)
      .then(handleErrors, handleErrors)
      .then(function(response) {
        // console.log("[DRS] [getAllMemberships] response: %o", response);
        data.memberships = [];
        response.data.Response.destinyMemberships.forEach(function(m) {
          const name = m.membershipType === 4
            ? (response.data.Response.bungieNetUser ? response.data.Response.bungieNetUser.blizzardDisplayName : data.player)
            : m.displayName;

          data.memberships.push({
            type: m.membershipType,
            id: m.membershipId,
            name: name,
            characterIds: [],
            existsOnPlatform: false
          });
        });
        return data;
      })
      .catch(function(error) {
        return $q.reject(error);
      });
  }

  function getBootstrapData(data) {
    function makeUrl() {
      return bungifyUrl('https://www.bungie.net/Platform/Destiny2/SearchDestinyPlayer/' + data.bootstrap.type + '/' + data.bootstrap.name + '/');
    }

    const url = makeUrl();
    return $q.when({
      method: 'GET',
      url: url,
      headers: {
        'X-API-Key': apiKey
      }
    })
      .then($http)
      .then(handleErrors, handleErrors)
      .then(function(response) {
        // console.log("[DRS] [getMembershipId] response: %o", response);
        if (response.data.Response.length <= 0) {
          return $q.reject(new Error($translate.instant('BungieService.NoAccount')));
        }
        data.bootstrap.type = response.data.Response[0].membershipType;
        data.bootstrap.id = response.data.Response[0].membershipId;
        return data;
      })
      .catch(function(error) {
        return $q.reject(error);
      });
  }

  // copied from DIM with modifications
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
      return $q.reject(createError($translate.instant('BungieService.NotConnected')));
    }
    if (response.status === 503 || response.status === 522 /* cloudflare */) {
      return $q.reject(createError($translate.instant('BungieService.Down')));
    }
    if (response.status < 200 || response.status >= 400) {
      return $q.reject(createError($translate.instant('BungieService.NetworkError')));
    }

    const errorCode = response.data ? response.data.ErrorCode : -1;

    // See https://github.com/DestinyDevs/BungieNetPlatform/wiki/Enums#platformerrorcodes
    switch (errorCode) {
    case 1: // Success
      return response;
    case 5: // SystemDisabled
      return $q.reject(createError($translate.instant('BungieService.Maintenance')));
    case 35: // ThrottleLimitExceededMinutes
    case 36: // ThrottleLimitExceededMomentarily
    case 37: // ThrottleLimitExceededSeconds
      return $q.reject(createError($translate.instant('BungieService.Throttled')));
    case 1601: // DestinyAccountNotFound
    case 1618: // DestinyUnexpectedError
      return $q.reject(createError($translate.instant('BungieService.NoAccount')));
    case 2101: // ApiInvalidOrExpiredKey
    case 2102: // ApiKeyMissingFromRequest
    case 2107: // OriginHeaderDoesNotMatchKey
      if ($DRS_FLAVOR === 'dev') {
        return $q.reject(createError($translate.instant('BungieService.DevVersion')));
      } else {
        return $q.reject(createError($translate.instant('BungieService.Difficulties')));
      }
    }

    // Any other error
    if (errorCode > 1) {
      if (response.data.Message) {
        return $q.reject(createError(response.data.Message));
      } else {
        return $q.reject(createError($translate.instant('BungieService.Difficulties')));
      }
    }

    return response;
  }
}

export default BungieLookupD2Service;