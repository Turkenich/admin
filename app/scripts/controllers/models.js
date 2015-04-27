'use strict';

angular.module('adminApp')
  .controller('ModelsCtrl', ['$scope', '$rootScope', '$routeParams', '$location', '$timeout', 'Elements', 'Models',
    function ($scope, $rootScope, $routeParams, $location, $timeout, Elements, Models) {

      $scope.reloadItem = function (item) {
        $rootScope.reloadItemImp($scope, Models, item, function () {
          $scope.parseElementsFromDb();
        });
      }
      $scope.updateItem = function (item) {
        item.elements = $scope.parseElementsToDb();
        $rootScope.updateItemImp($scope, Models, item);
      }
      $scope.removeItem = function (item) {
        $rootScope.removeItemImp($scope, Models, item, function () {
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

      var addId = $location.search()['addId'];

      $scope.removeElement = function (element) {
        console.log('deleting', element);
        if ($scope.elements && $scope.elements.length > 0) {
          var i = $scope.elements.findIndexById(element._id);
          $scope.elements.splice(i, 1);
        }

        $scope.updateItem($scope.item);
      }

      $scope.zeroElement = function (element) {
        if ($scope.elements && $scope.elements.length > 0) {
          var i = $scope.elements.findIndexById(element._id);
          $scope.elements[i].amount = 0;
        }

        $scope.updateItem($scope.item);
      }

      //private
      $scope.parseElementsFromDb = function () {

        if (!$scope.item || !$scope.item.elements) return;

        var eles = JSON.parse($scope.item.elements);

        if (addId) {
          debugger;
          eles.push({
            id: addId, amount: 1
          });
        }

        $scope.elements = [];
        for (var ele, e = 0; ele = eles[e]; e++) {
          Elements.query({'id': ele['id']}, function (_element) {
            _element.amount = eles.findById(_element._id, 'id').amount || 0;
            $scope.elements.push(_element);

            if (addId && ($scope.elements.length == eles.length)) {
              $scope.updateItem($scope.item);
              addId = false;
              $location.search({'addId': null});
            }
          });
        }


      }

      $scope.parseElementsToDb = function() {

        if (!$scope.item || !$scope.item.elements) return;

        var eles = [];
        for (var ele, e = 0; ele = $scope.elements[e]; e++) {
          eles.push({
            id: ele._id, amount: ele.amount
          });
        }

        $scope.item.elements = JSON.stringify(eles);
        return $scope.item.elements;

      }

    }]);
