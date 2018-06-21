function BroadcastChannelRun($rootScope, Constants, PlayerListService, PlayerListD2Service, UtilsService) {
  'ngInject';

  let channel;

  function initialize() {
    if (!('BroadcastChannel' in self)) {
      console.warn("Browser does not support 'BroadcastChannel'. The DRS extension will not work.");
      return;
    }

    channel = new BroadcastChannel('drs_in');
    channel.onmessage = (e) => {
      const lookup = e.data;

      if (UtilsService.isUndefinedOrNullOrEmpty(lookup.game) ||
        UtilsService.isUndefinedOrNullOrEmpty(lookup.lookup)) {
        console.warn("Unknown parameter(s) ('game' and/or 'lookup') received from context menu extension.");
        return;
      }

      if (lookup.game === Constants.games[0]) { // Destiny 1
        if (UtilsService.isUndefinedOrNullOrEmpty(lookup.platform)) {
          return;
        }

        PlayerListService.addPlayer(lookup.lookup, lookup.platform);
      } else if (lookup.game === Constants.games[1]) { // Destiny 2
        PlayerListD2Service.addPlayer(lookup.lookup);
      } else {
        console.warn("Unknown parameter ('game') received from contenxt menu extension.");
      }
    };
  }

  const listenerLoaded = $rootScope.$on("drs-settings-loaded", function() {
    initialize();
    listenerLoaded();
  });
}

export default BroadcastChannelRun;