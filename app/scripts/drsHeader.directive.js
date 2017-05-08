import angular from 'angular';

angular
  .module('drsApp')
  .directive('drsHeader', Header);

function Header() {
  const directive = {
    restrict: 'E',
    scope: {},
    template: `
      <div class="header">
        <h1 translate="{{'Application.Name'}}"></h1>
        <drs-input-player></drs-input-player>
      </div>
    `
  };
  return directive;
}