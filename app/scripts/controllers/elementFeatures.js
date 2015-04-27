'use strict';

angular.module('adminApp')
  .controller('ElementFeaturesCtrl', ['$scope', '$rootScope', '$routeParams', '$location', '$timeout', 'ElementFeatures',
    function ($scope, $rootScope, $routeParams, $location, $timeout, ElementFeatures) {

      $scope.reloadItem = function (item) {
        $rootScope.reloadItemImp($scope, ElementFeatures, item);
      }
      $scope.updateItem = function (item) {
        $rootScope.updateItemImp($scope, ElementFeatures, item);
      }
      $scope.removeItem = function (item) {
        $rootScope.removeItemImp($scope, ElementFeatures, item, function(){
          $location.path('/elementFeatures');
        });
      }
      $scope.addItem = function (item) {
        $rootScope.addItemImp($scope, ElementFeatures, null, function (item) {
          $location.path('/elementFeatures/' + item._id);
        });
      }

      $scope.duplicateItem = function (item) {
        $rootScope.tempItem = item;
        $rootScope.addItemImp($scope, ElementFeatures, null, function (item) {
          $location.path('/elementFeatures/' + item._id);
        });
      }


      //piece of code for item duplication
      if ($rootScope.tempItem) {
        $timeout(function () {
          $scope.item = $rootScope.tempItem;
          $scope.item['_id'] = $routeParams['id'];

          $rootScope.tempItem = null;
          $timeout(function () {
            $scope.updateItem($scope.item);
          })
        })
      } else {
        $scope.reloadItem({_id: $routeParams['id']});
      }

    }]);
