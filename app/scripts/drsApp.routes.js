
routes.$inject = ['$routeProvider'];

function routes($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: require('app/views/main.html')
    })
    .otherwise({
      redirectTo: "/"
    });
}

export default routes;