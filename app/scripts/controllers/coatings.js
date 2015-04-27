'use strict';

angular.module('adminApp')
  .controller('CoatingsCtrl', ['$scope', '$rootScope', '$routeParams', '$location', '$timeout', 'Coatings',
    function ($scope, $rootScope, $routeParams, $location, $timeout, Coatings) {

      $scope.reloadItem = function (item) {
        $rootScope.reloadItemImp($scope, Coatings, item);
      }
      $scope.updateItem = function (item) {
        $rootScope.updateItemImp($scope, Coatings, item);
      }
      $scope.removeItem = function (item) {
        $rootScope.removeItemImp($scope, Coatings, item, function(){
          $location.path('/coatings');
        });
      }
      $scope.addItem = function (item) {
        $rootScope.addItemImp($scope, Coatings, null, function (item) {
          $location.path('/coatings/' + item._id);
        });
      }

      $scope.duplicateItem = function (item) {
        $rootScope.tempItem = item;
        $rootScope.addItemImp($scope, Coatings, null, function (item) {
          $location.path('/coatings/' + item._id);
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
