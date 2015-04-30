'use strict';

angular.module('adminApp')
  .controller('SettingsCtrl', ['$scope', '$rootScope', '$routeParams', '$location', '$timeout', 'Settings',
    function ($scope, $rootScope, $routeParams, $location, $timeout, Settings) {

      $scope.reloadItem = function (item) {
        $rootScope.reloadItemImp($scope, Settings, item);
      }
      $scope.updateItem = function (item) {
        $rootScope.updateItemImp($scope, Settings, item);
      }
      $scope.removeItem = function (item) {
        $rootScope.removeItemImp($scope, Settings, item, function(){
          $location.path('/settings');
        });
      }
      $scope.addItem = function (item) {
        $rootScope.addItemImp($scope, Settings, null, function (item) {
          $location.path('/settings/' + item._id);
        });
      }

      $scope.duplicateItem = function (item) {
        $rootScope.tempItem = item;
        $rootScope.addItemImp($scope, Settings, null, function (item) {
          $location.path('/settings/' + item._id);
        });
      }

      $scope.moveItemDown = function(item){
        $rootScope.moveItemImp($scope, Settings, $scope.items, item, 1)
      }
      $scope.moveItemUp = function(item){
        $rootScope.moveItemImp($scope, Settings, $scope.items, item, -1)
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
