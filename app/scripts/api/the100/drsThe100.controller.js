export function The100Ctrl($rootScope, $routeParams, $timeout, Constants, SettingsService, The100Matcher, The100D2Matcher) {
  'ngInject';

  // const vm = this;
  let preloaded = false;

  function preLoad(gameId) {
    if (preloaded) {
      return;
    }

    preloaded = true;
    if (SettingsService.game === Constants.games[0]) {
      preLoadDestiny1(gameId);
    } else if (SettingsService.game === Constants.games[1]) {
      preLoadDestiny2(gameId);
    } else {
      console.log("Unknown game when attempting to preload");
    }
  }

  function preLoadDestiny1(gameId) {
    $timeout(function() {
      const userdata = { match: [] };
      userdata.match[1] = gameId;

      The100Matcher.runFn('', '', userdata)
        .catch(function() {
          // console.log("Failure with %o: %o", The100Matcher.name, error);
        });
    });
  }

  function preLoadDestiny2(gameId) {
    $timeout(function() {
      const userdata = { match: [] };
      userdata.match[1] = gameId;

      The100D2Matcher.runFn('', '', userdata)
        .catch(function() {
          // console.log("Failure with %o: %o", The100D2Matcher.name, error);
        });
    });
  }

  $rootScope.$on("drs-settings-loaded", function() {
    preLoad($routeParams.gameId);
  });

  if (SettingsService.loaded) {
    preLoad($routeParams.gameId);
  }
}