function MainController($rootScope, $routeParams, $timeout, $window, Constants, PlayerListService, PlayerListD2Service, SettingsService, UtilsService) {
  'ngInject';

  const vm = this;
  vm.problematicUrl = false;
  vm.fixedUrl = '';

  let preloaded = false;

  function preLoad(platform, players) {
    if (preloaded) {
      return;
    }

    preloaded = true;
    if (SettingsService.game === Constants.games[0]) {
      preLoadDestiny1(platform, players);
    } else if (SettingsService.game === Constants.games[1]) {
      preLoadDestiny2(players);
    } else {
      console.log("Unknown game when attempting to preload");
    }
  }

  function preLoadDestiny1(platform, players) {
    $timeout(function() {
      if (UtilsService.isUndefinedOrNullOrEmpty(platform) ||
        UtilsService.isUndefinedOrNullOrEmpty(players) ||
        (Constants.platforms.indexOf(platform.toUpperCase()) === -1)) {
        return;
      }

      platform = platform.toUpperCase();
      players = players.split('/');
      for (let i = 0; i < players.length; i++) {
        if (UtilsService.isUndefinedOrNullOrEmpty(players[i])) {
          continue;
        }

        PlayerListService.addPlayer(players[i], platform)
          .catch(function() {
            // console.log("PSN Id or Gamertag input failure: %o", error);
          });
      }
    });
  }

  function preLoadDestiny2(players) {
    players = players.split('/');
    for (let i = 0; i < players.length; i++) {
      if (UtilsService.isUndefinedOrNullOrEmpty(players[i])) {
        continue;
      }

      PlayerListD2Service.addPlayer(players[i])
          .catch(function() {
            // console.log("PSN Id or Gamertag or Battle.net ID input failure: %o", error);
          });
    }
  }

  function problematicUrl() {
    vm.problematicUrl = $window.location.href.indexOf('#') !== -1;

    if (vm.problematicUrl) {
      vm.fixedUrl = $window.location.href.replace(/#/g, '%23');
      vm.fixedUrl = vm.fixedUrl.replace(/%2F/g, '/');
    }

    return vm.problematicUrl;
  }

  if (!problematicUrl()) {
    $rootScope.$on("drs-settings-loaded", function() {
      preLoad($routeParams.platform, $routeParams.players);
    });

    if (!preloaded) {
      preLoad($routeParams.platform, $routeParams.players);
    }
  }
}

export default MainController;