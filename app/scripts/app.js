'use strict';

angular
  .module('adminApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute'
  ])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/orders', {
        templateUrl: 'views/orders.html',
        controller: 'OrdersCtrl'
      })
      .when('/orders/:id', {
        templateUrl: 'views/orders.html',
        controller: 'OrdersCtrl'
      })
      .when('/jeweleries', {
        templateUrl: 'views/jeweleries.html',
        controller: 'OrdersCtrl'
      })
      .when('/jeweleries/:id', {
        templateUrl: 'views/jeweleries.html',
        controller: 'OrdersCtrl'
      })
      .when('/elements', {
        templateUrl: 'views/elements.html',
        controller: 'ElementsCtrl'
      })
      .when('/elements/:id', {
        templateUrl: 'views/element.html',
        controller: 'ElementsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
