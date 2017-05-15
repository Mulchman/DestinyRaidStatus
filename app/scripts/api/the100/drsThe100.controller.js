export function The100Ctrl($routeParams, $timeout, The100Matcher) {
  'ngInject';

  // const vm = this;

  function preLoad(gameId) {
    $timeout(function () {
      const userdata = { match: [] };
      userdata.match[1] = gameId;

      The100Matcher.runFn('', '', userdata)
        .catch(function() {
          // console.log("Failure with %o: %o", The100Matcher.name, error);
        });
    });
  }

  preLoad($routeParams.gameId);
}