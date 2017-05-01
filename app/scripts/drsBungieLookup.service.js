(function() {
  'use strict';

  angular
    .module('drsApp')
    .service('BungieLookupService', BungieLookupService);

  function BungieLookupService($http, $q, RaidService) {
    // same strings from drsPlatform.service.js to streamline the lookup -> "membership[entry.platform]" (long term
    // probably not a good idea and PC support if this goes to D2...?)
    const membership = {
      'PS4': 2,
      'XB1': 1
    };

    // 1) Find membershipId through
    // http://www.bungie.net/Platform/Destiny/SearchDestinyPlayer/{membershipType}/{displayName}/
    // 2) Find character Ids through
    // http://www.bungie.net/Platform/Destiny/{membershipType}/Account/{destinyMembershipId}/Summary/
    // 3) Find raid completions through
    // http://www.bungie.net/Platform/Destiny/Stats/AggregateActivityStats/{membershipType}/{destinyMembershipId}/{characterId}/
    // 4) ...
    // 5) profit. Are there better endpoints to use? We only want very specific data...

    const service = {
      enqueue: enqueue
    };
    return service;

    function enqueue(entry) {
      let data = {
        gamertag: entry.gamertag,
        membership: membership[entry.platform],
        membershipId: null,
        characters: null
      };

      getMembershipId(data)
        .then(getCharacters)
        .then(function() {
          let promises = [
            getActivities(data)
          ];
          return $q.all(promises).then(function(data) {
            const onlyRaidActivities = _.reject(_.flatten(data[0]), function(activity) {
              return !_.contains(RaidService.raids, activity.activityHash);
            });

            RaidService.raids.forEach(function(raidHash) {
              entry.bungie[raidHash] = 0;
              onlyRaidActivities.forEach(function(activity) {
                if (activity.activityHash === raidHash) {
                  entry.bungie[raidHash] += activity.values.activityCompletions.basic.value;
                }
              });
            });
            entry.loading = false;

            return $q.resolve(data[0]);
          });
        })
        .catch(function(error) {
          entry.bungie = "Error loading user: " + error;
          entry.loading = false;
        });
    }

    function getActivities(data) {
      let promises = data.characters.map(function(character) {
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

      let errorCode = response.data ? response.data.ErrorCode : -1;

      // See https://github.com/DestinyDevs/BungieNetPlatform/wiki/Enums#platformerrorcodes
      switch (errorCode) {
        case 1: // Success
          return response;
        case 1627: // DestinyVendorNotFound
          return $q.reject(new Error($translate.instant('BungieService.VendorNotFound')));
        case 2106: // AuthorizationCodeInvalid
        case 2108: // AccessNotPermittedByApplicationScope
          //$rootScope.$broadcast('dim-no-token-found');
          return $q.reject("DIM does not have permission to perform this action.");
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
            return $q.reject(new Error(('BungieService.NoAccount', { platform: dimState.active.label })));
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
})();