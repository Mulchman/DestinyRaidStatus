import main from '../views/main.html';

routes.$inject = ['$routeProvider'];

function routes($routeProvider) {
  $routeProvider
    .when("/", {
      template: main
    })
    .when("/api/the100/:gameId", {
      template: main,
      controller: 'The100Ctrl',
      controllerAs: 'vm'
    })
    .when("/:platform/:players*", {
      template: main,
      controller: 'MainCtrl',
      controllerAs: 'vm'
    })
    .otherwise({
      redirectTo: "/"
    });
}

export default routes;