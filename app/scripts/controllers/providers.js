'use strict';

angular.module('adminApp')
  .controller('ProvidersCtrl', ['$scope', '$rootScope', '$routeParams', '$location', '$timeout', 'Providers',
    function ($scope, $rootScope, $routeParams, $location, $timeout, Providers) {

      $scope.reloadItem = function (item) {
        $rootScope.reloadItemImp($scope, Providers, item, function(){
          $scope.updateBreadcrumbs('ספקים', 'providers', $scope.item);
        });
      }
      $scope.updateItem = function (item) {
        $rootScope.updateItemImp($scope, Providers, item);
      }
      $scope.removeItem = function (item) {
        $rootScope.removeItemImp($scope, Providers, item, function(){
          $location.path('/providers');
        });
      }
      $scope.addItem = function (item) {
        $rootScope.addItemImp($scope, Providers, null, function (item) {
          $location.path('/providers/' + item._id);
        });
      }

      $scope.duplicateItem = function (item) {
        $rootScope.tempItem = item;
        $rootScope.addItemImp($scope, Providers, null, function (item) {
          $location.path('/providers/' + item._id);
        });
      }

      $scope.moveItemDown = function(item){
        $rootScope.moveItemImp($scope, Providers, $scope.items, item, 1)
      }
      $scope.moveItemUp = function(item){
        $rootScope.moveItemImp($scope, Providers, $scope.items, item, -1)
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
