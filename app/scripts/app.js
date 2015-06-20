'use strict';

angular
  .module('adminApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'angularFileUpload',
    'cloudinary',
    'ui.bootstrap',
    'ui.bootstrap.tpls',
    'ui.bootstrap.transition',
    'ngClipboard'
  ])
  .config(['$routeProvider', '$httpProvider', 'ngClipProvider', function ($routeProvider, $httpProvider, ngClipProvider) {
    $httpProvider.interceptors.push(function() {
      return {
        'request': function(config) {

          if (
            (config.url.indexOf('://turkenich') >= 0) ||
            (config.url.indexOf('://localhost') >= 0) ||
            (config.url.indexOf('://127.0.0.1') >= 0)
          ) {
            config.headers.Authorization = (localStorage['Authorization']);
          }
          return config;
        }
      };
    });

    ngClipProvider.setPath("images/ZeroClipboard.swf");
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      }).
      when('/upload', {
        templateUrl: 'views/partials/photo-upload.html',
        controller: 'photoUploadCtrl'
      })
      .when('/settings', {
        templateUrl: 'views/settings.html',
        controller: 'SettingsCtrl',
        reloadOnSearch: false
      })
      .when('/orders', {
        templateUrl: 'views/orders.html',
        controller: 'OrdersCtrl',
        reloadOnSearch: false
      })
      .when('/orders/:id', {
        templateUrl: 'views/order.html',
        controller: 'OrdersCtrl',
        reloadOnSearch: false
      })

      .when('/models', {
        templateUrl: 'views/models.html',
        controller: 'ModelsCtrl',
        reloadOnSearch: false
      })
      .when('/models/:id', {
        templateUrl: 'views/model.html',
        controller: 'ModelsCtrl',
        reloadOnSearch: false
      })

      .when('/elements', {
        templateUrl: 'views/elements.html',
        controller: 'ElementsCtrl',
        reloadOnSearch: false
      })
      .when('/elements/:id', {
        templateUrl: 'views/element.html',
        controller: 'ElementsCtrl',
        reloadOnSearch: false
      })

      .when('/prices', {
        templateUrl: 'views/prices.html',
        controller: 'PricesCtrl',
        reloadOnSearch: false
      })
      .when('/prices/:id', {
        templateUrl: 'views/price.html',
        controller: 'PricesCtrl',
        reloadOnSearch: false
      })

      .when('/coatings', {
        templateUrl: 'views/coatings.html',
        controller: 'CoatingsCtrl'
      })
      .when('/coatings/:id', {
        templateUrl: 'views/coating.html',
        controller: 'CoatingsCtrl'
      })
      .when('/materials', {
        templateUrl: 'views/materials.html',
        controller: 'MaterialsCtrl'
      })
      .when('/materials/:id', {
        templateUrl: 'views/material.html',
        controller: 'MaterialsCtrl'
      })
      .when('/providers', {
        templateUrl: 'views/providers.html',
        controller: 'ProvidersCtrl'
      })
      .when('/providers/:id', {
        templateUrl: 'views/provider.html',
        controller: 'ProvidersCtrl'
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
