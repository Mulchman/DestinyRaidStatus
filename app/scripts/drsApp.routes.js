
routes.$inject = ['$routeProvider'];

function routes($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: require('app/views/main.html')
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