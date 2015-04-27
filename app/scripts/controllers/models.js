'use strict';

angular.module('adminApp')
  .controller('ModelsCtrl', ['$scope', '$rootScope', '$routeParams', '$location', '$timeout', 'Models',
    function ($scope, $rootScope, $routeParams, $location, $timeout, Models) {

      $scope.reloadItem = function (item) {
        $rootScope.reloadItemImp($scope, Models, item);
      }
      $scope.updateItem = function (item) {
        $rootScope.updateItemImp($scope, Models, item);
      }
      $scope.removeItem = function (item) {
        $rootScope.removeItemImp($scope, Models, item, function(){
          $location.path('/models');
        });
      }
      $scope.addItem = function (item) {
        $rootScope.addItemImp($scope, Models, null, function (item) {
          $location.path('/models/' + item._id);
        });
      }

      $scope.duplicateItem = function (item) {
        $rootScope.tempItem = item;
        $rootScope.addItemImp($scope, Models, null, function (item) {
          $location.path('/models/' + item._id);
        });
      }


      //piece of code for item duplication
      if ($rootScope.tempItem) {
        $timeout(function () {
          debugger;
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
