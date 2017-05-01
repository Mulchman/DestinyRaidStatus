function routes($routeProvider) {
  'ngInject';

  $routeProvider
    .when("/", {
      templateUrl: require('app/views/main.html')
    });
}

export default routes;