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
      .when('/coatings', {
        templateUrl: 'views/coatings.html',
        controller: 'CoatingsCtrl'
      })
      .when('/coatings/:id', {
        templateUrl: 'views/coating.html',
        controller: 'CoatingsCtrl'
      })
      .when('/elementFeatures', {
        templateUrl: 'views/elementFeatures.html',
        controller: 'ElementFeaturesCtrl'
      })
      .when('/elementFeatures/:id', {
        templateUrl: 'views/elementFeature.html',
        controller: 'ElementFeaturesCtrl'
      })
      .when('/elementTypes', {
        templateUrl: 'views/elementTypes.html',
        controller: 'ElementTypesCtrl'
      })
      .when('/elementTypes/:id', {
        templateUrl: 'views/elementType.html',
        controller: 'ElementTypesCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
