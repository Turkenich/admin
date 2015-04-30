'use strict';

angular.module('adminApp')
  .controller('OrdersCtrl', ['$scope', '$rootScope', '$routeParams', '$location', '$timeout', 'Elements', 'Models', 'Orders',
    function ($scope, $rootScope, $routeParams, $location, $timeout, Elements, Models, Orders) {

      $scope.reloadItem = function (item) {
        $rootScope.reloadItemImp($scope, Orders, item, function () {
          $scope.parseModelsFromDb();
          $scope.updateBreadcrumbs('הזמנות', 'orders', $scope.item);
        });
      }
      $scope.updateItem = function (item) {
        item.models = $scope.parseModelsToDb();
        $rootScope.updateItemImp($scope, Orders, item);
      }
      $scope.removeItem = function (item) {
        $rootScope.removeItemImp($scope, Orders, item, function () {
          $location.path('/orders');
        });
      }
      $scope.addItem = function (item) {
        $rootScope.addItemImp($scope, Orders, null, function (item) {
          $location.path('/orders/' + item._id);
        });
      }

      $scope.duplicateItem = function (item) {
        $rootScope.tempItem = item;
        $rootScope.addItemImp($scope, Orders, null, function (item) {
          $location.path('/orders/' + item._id);
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

      $rootScope.filter = {};

      $scope.removeModel = function (model) {
        console.log('deleting', model);
        if ($scope.models && $scope.models.length > 0) {
          var i = $scope.models.findIndexById(model._id);
          $scope.models.splice(i, 1);
        }

        $scope.updateItem($scope.item);
      }

      $scope.zeroModel = function (model) {
        if ($scope.models && $scope.models.length > 0) {
          var i = $scope.models.findIndexById(model._id);
          $scope.models[i].amount = 0;
        }

        $scope.updateItem($scope.item);
      }

      //private
      $scope.parseModelsFromDb = function () {

        if (!$scope.item) return;
        if (!$scope.item.models) $scope.item.models = "[]";

        var eles = JSON.parse($scope.item.models);

        if (addId) {
          eles.push({
            id: addId, amount: 1
          });
        }

        $scope.models = [];
        for (var ele, e = 0; ele = eles[e]; e++) {
          Models.query({'id': ele['id']}, function (_model) {
            _model.amount = eles.findById(_model._id, 'id').amount || 0;
            $scope.models.push(_model);

            if (addId && ($scope.models.length == eles.length)) {
              $scope.updateItem($scope.item);
              addId = false;
              $location.search({'addId': null});
            }

            if (($scope.models.length == eles.length)) {
              $scope.getOrderElements();
            }
          });
        }


      }


      $scope.parseModelsToDb = function () {

        if (!$scope.item || !$scope.item.models) return;

        var eles = [];
        for (var ele, e = 0; ele = $scope.models[e]; e++) {
          eles.push({
            id: ele._id, amount: ele.amount
          });
        }

        $scope.item.models = JSON.stringify(eles);
        return $scope.item.models;

      }

      $scope.getOrderElements = function () {

        if (!$scope.models || !$scope.models.length) return;

        var elements = {};
        for (var model, i = 0; model = $scope.models[i]; i++) {
          var eles = JSON.parse(model.elements);
          for (var ele, j = 0; ele = eles[j]; j++) {
            if (!elements[ele.id]) elements[ele.id] = 0;
            elements[ele.id] += 1;
          }
        }

        $scope.elements = [];
        for (var e in elements) {
          Elements.query({'id': e}, function (_element) {
            $scope.elements.push(_element);

            if (($scope.elements.length == eles.length)) {
              $scope.orderCost();
            }

          });
        }
      }

      $scope.updateOrderQuantities = function () {

        $scope.totalWorkTime = 0;

        var elements = {};
        for (var model, i = 0; model = $scope.models[i]; i++) {
          $scope.totalWorkTime += model.amount * (model.requiredTime || 0);
          var eles = JSON.parse(model.elements);
          for (var ele, j = 0; ele = eles[j]; j++) {
            if (!elements[ele.id]) elements[ele.id] = 0;
            elements[ele.id] += (model.amount * ele.amount);
          }
        }

        for (var e in elements) {
          //var amount = elements[e]; //not needed
          var ele = $scope.elements.findIndexById(e);
          if (ele >= 0) {
            $scope.elements[ele].amount = (elements[e] || 0);
          }
        }
      }

      $scope.orderCost = function () {

        if (!$scope.elements || !$scope.elements.length>0) {
          return
        }

        $scope.updateOrderQuantities();
        return $scope.elementsCost({requiredTime: $scope.totalWorkTime}, $scope.elements);

      }


    }]);
