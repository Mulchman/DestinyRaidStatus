import template from './drsInputPlayer.D2.template.html';

function InputPlayerD2Ctrl(InputPlayerD2Service) {
  'ngInject';

  const vm = this;

  vm.keyup = keyup;
  vm.player = "";
  vm.run = run;

  function keyup(event) {
    if (event.keyCode === 13) {
      vm.run();
    }
  }

  function run() {
    const player = vm.player;

    InputPlayerD2Service.add(player);
    vm.player = "";
  }
}

export const InputPlayerD2Component = {
  controller: InputPlayerD2Ctrl,
  template: template
};