'use strict';

angular.module('adminApp')
  .controller('ElementsCtrl', ['$scope', 'Elements', 'Jewellery', function ($scope, Elements, Jewellery) {
    function getItems() {
      $scope.items = Elements.all();
    }

    getItems();
    $scope.updateItem = function (item) {
      console.log('updating', item);
      item.$update(function (item) {
        Elements.query({id: item._id}, function (item) {
          var i = $scope.items.findIndexById(item._id);
          $scope.items[i] = item;
        });
      });
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

  }]);
