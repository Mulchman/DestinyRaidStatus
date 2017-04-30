(function() {
  'use strict';

  angular
    .module("drsApp", [
      "ngRoute"
    ])
    .config(function($routeProvider) {
      $routeProvider
        .when("/", {
          templateUrl: "views/main.html"
        });
    });
})();