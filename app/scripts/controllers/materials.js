'use strict';

angular.module('adminApp')
  .controller('MaterialsCtrl', ['$scope', '$rootScope', '$routeParams', '$location', '$timeout', 'Materials',
    function ($scope, $rootScope, $routeParams, $location, $timeout, Materials) {

      $scope.reloadItem = function (item) {
        $rootScope.reloadItemImp($scope, Materials, item, function(){
          $scope.updateBreadcrumbs('חומרים', 'materials', $scope.item);
        });
      }
      $scope.updateItem = function (item) {
        $rootScope.updateItemImp($scope, Materials, item);
        $rootScope.init();
      }
      $scope.removeItem = function (item) {
        $rootScope.removeItemImp($scope, Materials, item, function(){
          $location.path('/materials');
        });
      }
      $scope.addItem = function (item) {
        $rootScope.addItemImp($scope, Materials, null, function (item) {
          $location.path('/materials/' + item._id);
        });
      }

      $scope.duplicateItem = function (item) {
        $rootScope.tempItem = item;
        $rootScope.addItemImp($scope, Materials, null, function (item) {
          $location.path('/materials/' + item._id);
        });
      }

      $scope.moveItemDown = function(item){
        $rootScope.moveItemImp($scope, Materials, $scope.items, item, 1)
      }
      $scope.moveItemUp = function(item){
        $rootScope.moveItemImp($scope, Materials, $scope.items, item, -1)
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
