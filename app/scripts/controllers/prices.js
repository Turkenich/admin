'use strict';

angular.module('adminApp')
  .controller('PricesCtrl', ['$scope', '$rootScope', '$routeParams', '$location', '$timeout', 'Prices',
    function ($scope, $rootScope, $routeParams, $location, $timeout, Prices) {

      $scope.reloadItem = function (item) {
        $rootScope.reloadItemImp($scope, Prices, item);
      }
      $scope.updateItem = function (item) {
        $rootScope.updateItemImp($scope, Prices, item);
      }
      $scope.removeItem = function (item) {
        $rootScope.removeItemImp($scope, Prices, item, function(){
          $location.path('/prices');
        });
      }
      $scope.addItem = function (item) {
        $rootScope.addItemImp($scope, Prices, null, function (item) {
          $location.path('/prices/' + item._id);
        });
      }

      $scope.duplicateItem = function (item) {
        $rootScope.tempItem = item;
        $rootScope.addItemImp($scope, Prices, null, function (item) {
          $location.path('/prices/' + item._id);
        });
      }

      $scope.moveItemDown = function(item){
        $rootScope.moveItemImp($scope, Prices, $scope.items, item, 1)
      }
      $scope.moveItemUp = function(item){
        $rootScope.moveItemImp($scope, Prices, $scope.items, item, -1)
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
