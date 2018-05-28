import template from './drsInputPlayer2.template.html';

function InputPlayer2Ctrl(PlayerList2Service) {
  'ngInject';

  const vm = this;

  vm.keyup = keyup;
  vm.player = "";
  vm.run = run;

  function add(player) {
    PlayerList2Service.addPlayer(player)
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
    // TODO: similar stuff to the D1 route (test other matchers first (eg. The100.io), etc.)
    add(player);
  }

  // TODO: route in Destiny 2 lookups (this functionality was never finished w/ the D1 version, either)
  /*
  if (Constants.isExtension) {
    chrome.runtime.onMessage.addListener(function(request) {
      console.log("Looking up '%o' via context menu tie-in!", request.lookup);
      vm.player = request.lookup;
      vm.run();
    });
  }
  */
}

export const InputPlayer2Component = {
  controller: InputPlayer2Ctrl,
  template: template
};