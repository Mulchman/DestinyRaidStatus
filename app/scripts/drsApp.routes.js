
routes.$inject = ['$routeProvider'];

function routes($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: require('app/views/main.html')
    })
    .when("/api/the100/:gameId", {
      templateUrl: require('app/views/main.html'),
      controller: 'The100Ctrl',
      controllerAs: 'vm'
    })
    .when("/:platform/:players*", {
      templateUrl: require('app/views/main.html'),
      controller: 'MainCtrl',
      controllerAs: 'vm'
    })
    .otherwise({
      redirectTo: "/"
    });
}

export default routes;