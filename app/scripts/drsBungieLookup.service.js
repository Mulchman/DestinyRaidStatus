import angular from 'angular';
import _ from 'underscore';

angular
  .module('drsApp')
  .factory('BungieLookupService', BungieLookupService);


// 1) Find membershipId through
// http://www.bungie.net/Platform/Destiny/SearchDestinyPlayer/{membershipType}/{displayName}/
// 2) Find character Ids through
// http://www.bungie.net/Platform/Destiny/{membershipType}/Account/{destinyMembershipId}/Summary/
// 3) Find raid completions through
// http://www.bungie.net/Platform/Destiny/Stats/AggregateActivityStats/{membershipType}/{destinyMembershipId}/{characterId}/
// 4) ...
// 5) profit. Are there better endpoints to use? We only want very specific data...

function BungieLookupService($http, $q, QueueService, RaidService) {
  // same strings from drsPlatform.service.js to streamline the lookup -> "membership[entry.platform]" (long term
  // probably not a good idea and PC support if this goes to D2...?)
  const membership = {
    PS4: 2,
    XB1: 1
  };

  const apiKey = $DRS_API_KEY;

  const lookup = QueueService.wrap(function(entry) {
    const data = {
      gamertag: entry.gamertag,
      membership: membership[entry.platform],
      membershipId: null,
      characters: null
    };

    return getMembershipId(data)
      .then(getCharacters)
      .then(function() {
        const promises = [
          getActivities(data)
        ];
        return $q.all(promises).then(function(data) {
          const onlyRaidActivities = _.reject(_.flatten(data[0]), function(activity) {
            return !_.contains(RaidService.raids, activity.activityHash);
          });

          const stats = {};
          RaidService.raids.forEach(function(raidHash) {
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
    const promises = data.characters.map(function(character) {
      return $q.when(getAggregateActivityStats(data.membership, data.membershipId, character.characterBase.characterId))
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
      return 'http://www.bungie.net/Platform/Destiny/Stats/AggregateActivityStats/' + membership + '/' + membershipId + '/' + characterId + '/';
    }

    return $q.all(promises);
  }

  function getCharacters(data) {
    function getAccountSummaryUrl() {
      return 'http://www.bungie.net/Platform/Destiny/' + data.membership + '/Account/' + data.membershipId + '/Summary/';
    }

    const url = getAccountSummaryUrl();
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
        data.characters = response.data.Response.data.characters;
        return data;
      });
  }

  function getMembershipId(data) {
    function getSearchDestinyPlayerUrl() {
      return 'http://www.bungie.net/Platform/Destiny/SearchDestinyPlayer/' + data.membership + '/' + data.gamertag + '/';
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
          return $q.reject(new Error('Could not find user. Check spelling and/or platform.'));
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
    // TODO: do we actually care about anything except 200? If not 200 we can't do anything.

    // TODO: the extra parenthesis are from DIM code having $translate.instant around the strings. I'm lazy
    // TODO: and haven't added the translation dependency yet.

    if (response.status === -1) {
      return $q.reject(new Error(('BungieService.NotConnected')));
    }
    if (response.status === 503 || response.status === 522 /* cloudflare */) {
      return $q.reject(new Error(('BungieService.Down')));
    }
    if (response.status < 200 || response.status >= 400) {
      return $q.reject(new Error(('BungieService.NetworkError', {
        status: response.status,
        statusText: response.statusText
      })));
    }

    const errorCode = response.data ? response.data.ErrorCode : -1;

    // See https://github.com/DestinyDevs/BungieNetPlatform/wiki/Enums#platformerrorcodes
    switch (errorCode) {
    case 1: // Success
      return response;
    case 1627: // DestinyVendorNotFound
      return $q.reject(new Error(('BungieService.VendorNotFound')));
    case 2106: // AuthorizationCodeInvalid
    case 2108: // AccessNotPermittedByApplicationScope
        // $rootScope.$broadcast('dim-no-token-found');
      return $q.reject("DRS does not have permission to perform this action.");
    case 5: // SystemDisabled
      return $q.reject(new Error(('BungieService.Maintenance')));
    case 35: // ThrottleLimitExceededMinutes
    case 36: // ThrottleLimitExceededMomentarily
    case 37: // ThrottleLimitExceededSeconds
      return $q.reject(new Error(('BungieService.Throttled')));
    case 2111: // token expired
    case 99: // WebAuthRequired
        /*
         if (window.chrome && window.chrome.extension) {
         openBungieNetTab();
         } else {
         $rootScope.$broadcast('dim-no-token-found');
         }
         */
      return $q.reject(new Error(('BungieService.NotLoggedIn')));
    case 1601: // DestinyAccountNotFound
    case 1618: // DestinyUnexpectedError
      if (response.config.url.indexOf('/Account/') >= 0 &&
          response.config.url.indexOf('/Character/') < 0) {
        return $q.reject(new Error(('BungieService.NoAccount')));
      }
    case 2101: // ApiInvalidOrExpiredKey
    case 2102: // ApiKeyMissingFromRequest
    case 2107: // OriginHeaderDoesNotMatchKey
        /*
         if ($DIM_FLAVOR === 'dev') {
         $state.go('developer');
         return $q.reject(new Error($translate.instant('BungieService.DevVersion')));
         } else {
         return $q.reject(new Error($translate.instant('BungieService.Difficulties')));
         }
         */
      return $q.reject(new Error(('BungieService.Difficulties')));
    }

    // Any other error
    if (errorCode > 1) {
      if (response.data.Message) {
        const error = new Error(response.data.Message);
        error.code = response.data.ErrorCode;
        error.status = response.data.ErrorStatus;
        return $q.reject(error);
      } else {
        return $q.reject(new Error(('BungieService.Difficulties')));
      }
    }

    return response;
  }
}