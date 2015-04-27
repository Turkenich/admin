'use strict';

angular.module('adminApp')
  .controller('ElementTypesCtrl', ['$scope', '$rootScope', '$routeParams', '$location', '$timeout', 'ElementTypes',
    function ($scope, $rootScope, $routeParams, $location, $timeout, ElementTypes) {

      $scope.reloadItem = function (item) {
        $rootScope.reloadItemImp($scope, ElementTypes, item);
      }
      $scope.updateItem = function (item) {
        $rootScope.updateItemImp($scope, ElementTypes, item);
      }
      $scope.removeItem = function (item) {
        $rootScope.removeItemImp($scope, ElementTypes, item, function(){
          $location.path('/elementTypes');
        });
      }
      $scope.addItem = function (item) {
        $rootScope.addItemImp($scope, ElementTypes, null, function (item) {
          $location.path('/elementTypes/' + item._id);
        });
      }

      $scope.duplicateItem = function (item) {
        $rootScope.tempItem = item;
        $rootScope.addItemImp($scope, ElementTypes, null, function (item) {
          $location.path('/elementTypes/' + item._id);
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

      $scope.measureUnits = [
        {name: "גרם", _id: 'gram'},
        {name: "סנטימטר", _id: 'centimeter'},
        {name: "יחידה", _id: 'unit'},
      ]

    }]);
