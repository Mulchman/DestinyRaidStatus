(function() {
  'use strict';

  angular
    .module("drsApp", [
      "ngAnimate",
      "ngAria",
      "ngMaterial",
      "ngMessages",
      "ngRoute"
    ])
    .config(function($routeProvider) {
      $routeProvider
        .when("/", {
          templateUrl: "views/main.html"
        });
    });
})();