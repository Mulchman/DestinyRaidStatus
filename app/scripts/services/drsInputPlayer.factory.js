function InputPlayerService(InputMatcherService, PlayerListService) {
  'ngInject';

  const service = {
    add: add
  };
  return service;

  function add(player, platform) {
    const matcherFns = InputMatcherService.getMatcherFns();
    for (let i = 0; i < matcherFns.length; i++) {
      const matcher = matcherFns[i];

      const userdata = {};
      if (matcher.testFn(player, platform, userdata)) {
        matcher.runFn(player, platform, userdata)
          .catch(function(error) {
            console.error("PSN Id or Gamertag input failure with %o: %o", matcher.name, error);
          });

        return;
      }
    }

    PlayerListService.addPlayer(player, platform)
      .catch(function(error) {
        console.error("PSN Id or Gamertag input failure: %o", error);
      });
  }
}

export default InputPlayerService;