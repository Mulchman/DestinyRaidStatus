import template from './drsInputPlayer.D2.template.html';

function InputPlayerD2Ctrl(InputMatcherD2Service, PlayerListD2Service) {
  'ngInject';

  const vm = this;

  vm.keyup = keyup;
  vm.player = "";
  vm.run = run;

  function add(player) {
    PlayerListD2Service.addPlayer(player)
      .catch(function() {
        // console.log("PSN Id or Gamertag or Battle.net ID input failure: %o", error);
      });

    vm.player = "";
  }

  function keyup(event) {
    if (event.keyCode === 13) {
      vm.run();
    }
  }

  function run() {
    const player = vm.player;

    const matcherFns = InputMatcherD2Service.getMatcherFns();
    for (let i = 0; i < matcherFns.length; i++) {
      const matcher = matcherFns[i];

      const userdata = {};
      if (matcher.testFn(player, '', userdata)) {
        vm.player = "";

        matcher.runFn(player, '', userdata)
          .catch(function() {
            // console.log("PSN Id or Gamertag or Battle.net ID input failure with %o: %o", matcher.name, error);
          });

        return;
      }
    }

    add(player);
  }
}

export const InputPlayerD2Component = {
  controller: InputPlayerD2Ctrl,
  template: template
};