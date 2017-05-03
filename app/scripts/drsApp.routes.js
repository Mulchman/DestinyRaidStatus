
routes.$inject = ['$routeProvider'];

function routes($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: require('app/views/main.html')
    });
}

export default routes;