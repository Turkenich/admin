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
            .when('/users', {
                templateUrl: 'views/users.html',
                controller: 'UsersCtrl'
            })
            .when('/media', {
                templateUrl: 'views/media.html',
                controller: 'MediaCtrl'
            })
            .when('/media/:id', {
                templateUrl: 'views/media.html',
                controller: 'MediaCtrl'
            })
            .when('/kennels', {
              templateUrl: 'views/kennels.html',
              controller: 'KennelsCtrl'
            })
            .when('/pets', {
                templateUrl: 'views/pets.html',
                controller: 'PetsCtrl'
            })
            .when('/pets/:id', {
                templateUrl: 'views/pets.html',
                controller: 'PetsCtrl'
            })
            .when('/pet/:id', {
                templateUrl: 'views/pets.html',
                controller: 'PetsCtrl'
            })
            .when('/treats', {
                templateUrl: 'views/treats.html',
                controller: 'TreatsCtrl'
            })
            .when('/donations', {
                templateUrl: 'views/donations.html',
                controller: 'DonationsCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    }]);
