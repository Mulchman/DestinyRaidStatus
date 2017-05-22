import angular from 'angular';
import _ from 'lodash';

angular
  .module('drsApp')
  .factory('BungieLookupService', BungieLookupService);

function BungieLookupService($http, $q, $translate, Constants, QueueService) {
  'ngInject';

  // same strings from drsPlatform.service.js to streamline the lookup -> "membership[entry.platform]" (long term
  // probably not a good idea and PC support if this goes to D2...?)
  const membership = {
    PSN: 2,
    XBL: 1
  };

  const apiKey = $DRS_API_KEY;

  const lookup = QueueService.wrap(function(entry) {
    // 1) Find membershipId through
    // https://www.bungie.net/Platform/Destiny/SearchDestinyPlayer/{membershipType}/{displayName}/
    // 2) Find character Ids through (even deleted ones!)
    // https://www.bungie.net/Platform/Destiny/Stats/Account/{membershipType}/{destinyMembershipId}/
    // 3) Find raid completions through
    // https://www.bungie.net/Platform/Destiny/Stats/AggregateActivityStats/{membershipType}/{destinyMembershipId}/{characterId}/
    // 4) ...
    // 5) profit. Are there better endpoints to use? We only want very specific data.
    const data = {
      player: entry.player,
      membership: membership[entry.platform],
      membershipId: null,
      characterIds: null
    };

    return getMembershipId(data)
      .then(getAllCharacters)
      .then(function() {
        const promises = [
          getActivities(data)
        ];
        return $q.all(promises).then(function(data) {
          const onlyRaidActivities = _.reject(_.flatten(data[0]), function(activity) {
            return !_.includes(Constants.raids, activity.activityHash);
          });

          const stats = {};
          Constants.raids.forEach(function(raidHash) {
            stats[raidHash] = 0;
            onlyRaidActivities.forEach(function(activity) {
              if (activity.activityHash === raidHash) {
                stats[raidHash] += activity.values.activityCompletions.basic.value;
              }
            });
          });

          return $q.resolve(stats);
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

  function getActivities(data) {
    const promises = data.characterIds.map(function(characterId) {
      return $q.when(getAggregateActivityStats(data.membership, data.membershipId, characterId))
        .then($http)
        .then(handleErrors, handleErrors)
        .then(function(response) {
          return response.data.Response.data.activities;
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
      return 'https://www.bungie.net/Platform/Destiny/Stats/AggregateActivityStats/' + membership + '/' + membershipId + '/' + characterId + '/';
    }

    return $q.all(promises);
  }

  function getAllCharacters(data) {
    function getHistoricalStatsForAccountUrl() {
      return 'https://www.bungie.net/Platform/Destiny/Stats/Account/' + data.membership + '/' + data.membershipId + '/';
    }

    const url = getHistoricalStatsForAccountUrl();
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
        data.characterIds = _.map(response.data.Response.characters, 'characterId');
        return data;
      });
  }

  function getMembershipId(data) {
    function getSearchDestinyPlayerUrl() {
      return 'https://www.bungie.net/Platform/Destiny/SearchDestinyPlayer/' + data.membership + '/' + data.player + '/';
    }

    const url = getSearchDestinyPlayerUrl();
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
        if (response.data.Response.length <= 0) {
          return $q.reject(new Error($translate.instant('BungieService.NoAccount')));
        }

        data.membershipId = response.data.Response[0].membershipId;
        return data;
      })
      .catch(function(error) {
        return $q.reject(error);
      });
  }

  // copied from DIM with modifications
  function handleErrors(response) {
    if (response.status === -1) {
      return $q.reject(new Error($translate.instant('BungieService.NotConnected')));
    }
    if (response.status === 503 || response.status === 522 /* cloudflare */) {
      return $q.reject(new Error($translate.instant('BungieService.Down')));
    }
    if (response.status < 200 || response.status >= 400) {
      return $q.reject(new Error($translate.instant('BungieService.NetworkError', {
        status: response.status,
        statusText: response.statusText
      })));
    }

    const errorCode = response.data ? response.data.ErrorCode : -1;

    // See https://github.com/DestinyDevs/BungieNetPlatform/wiki/Enums#platformerrorcodes
    switch (errorCode) {
    case 1: // Success
      return response;
    case 5: // SystemDisabled
      return $q.reject(new Error($translate.instant('BungieService.Maintenance')));
    case 35: // ThrottleLimitExceededMinutes
    case 36: // ThrottleLimitExceededMomentarily
    case 37: // ThrottleLimitExceededSeconds
      return $q.reject(new Error($translate.instant('BungieService.Throttled')));
    case 1601: // DestinyAccountNotFound
    case 1618: // DestinyUnexpectedError
      return $q.reject(new Error($translate.instant('BungieService.NoAccount')));
    case 2101: // ApiInvalidOrExpiredKey
    case 2102: // ApiKeyMissingFromRequest
    case 2107: // OriginHeaderDoesNotMatchKey
      if ($DRS_FLAVOR === 'dev') {
        return $q.reject(new Error($translate.instant('BungieService.DevVersion')));
      } else {
        return $q.reject(new Error($translate.instant('BungieService.Difficulties')));
      }
    }

    // Any other error
    if (errorCode > 1) {
      if (response.data.Message) {
        const error = new Error(response.data.Message);
        error.code = response.data.ErrorCode;
        error.status = response.data.ErrorStatus;
        return $q.reject(error);
      } else {
        return $q.reject(new Error($translate.instant('BungieService.Difficulties')));
      }
    }

    return response;
  }
}