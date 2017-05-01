(function() {
  'use strict';

  angular
    .module('drsApp')
    .service('BungieLookupService', BungieLookupService);

  function BungieLookupService($http, $q) {
    // same strings from drsPlatform.service.js to hopefully streamline it
    const membership = {
      'PS4': 2,
      'XB1': 1
    };


    // http://www.bungie.net/Platform/Destiny/SearchDestinyPlayer/{membershipType}/{displayName}/

    const service = {
      enqueue: enqueue
    };
    return service;

    function enqueue(entry) {
      const url = 'http://www.bungie.net/Platform/Destiny/SearchDestinyPlayer/' + membership[entry.platform] + '/' + entry.gamertag + '/';
      console.log("[drs] url: %o", url);

      getMembershipId(url)
        .then(function success(membershipId) {
          console.log("[drs] membershipId: %o", membershipId);
        }, function failure(response) {
          console.log("[drs] response: %o", response);
        });


    }

    function getMembershipId(url) {
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
          return response.data.Response[0].membershipId;
        });
    }

    // copied from DIM with modifications
    function handleErrors(response) {
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

      var errorCode = response.data ? response.data.ErrorCode : -1;

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