function InputPlayerD2Service(InputMatcherD2Service, PlayerListD2Service) {
  'ngInject';

  const service = {
    add: add
  };
  return service;

  function add(player) {
    const matcherFns = InputMatcherD2Service.getMatcherFns();
    for (let i = 0; i < matcherFns.length; i++) {
      const matcher = matcherFns[i];

      const userdata = {};
      if (matcher.testFn(player, '', userdata)) {
        matcher.runFn(player, '', userdata)
          .catch(function(error) {
            console.error("PSN Id or Gamertag or Battle.net ID input failure with %o: %o", matcher.name, error);
          });

        return;
      }
    }

    PlayerListD2Service.addPlayer(player)
      .catch(function(error) {
        console.error("PSN Id or Gamertag or Battle.net ID input failure: %o", error);
      });
  }
}

export default InputPlayerD2Service;