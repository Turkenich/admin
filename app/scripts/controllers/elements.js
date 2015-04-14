'use strict';

angular.module('adminApp')
  .controller('ElementsCtrl', ['$scope', '$routeParams', 'Elements', 'ElementTypes', 'Jewellery', function ($scope, $routeParams, Elements, ElementTypes, Jewellery) {

    if ($routeParams['id']) {
      $scope.item = Elements.query({'id': $routeParams['id']});
    } else {
      $scope.items = Elements.all();
    }
    $scope.updateItem = function () {
      console.log('updating', $scope.item);
      $scope.item.$update();
    }
    $scope.removeItem = function (item) {
      if (confirm('Are You Sure???')) {
        console.log('deleting', item);
        var i = $scope.items.findIndexById(item._id);
        Elements.remove({id: item._id});
        $scope.items.splice(i, 1);
      }
    }
    $scope.addItem = function () {
      Elements.create(function (item) {
        Elements.query({id: item._id}, function (item) {
          $scope.items.push(item);
        });
      });
    }


    $scope.elementTypes = ElementTypes.all();
    console.log($scope.elementTypes);
  }]);
