'use strict';

angular.module('adminApp')
  .controller('OrdersCtrl', ['$scope', '$rootScope', '$routeParams', '$location', '$timeout', 'Elements', 'Models', 'Orders',
    function ($scope, $rootScope, $routeParams, $location, $timeout, Elements, Models, Orders) {

      $rootScope.init();

      $scope.reloadItem = function (item) {
        $rootScope.anyDbloading = true;
        $rootScope.reloadItemImp($scope, Orders, item, function () {
          $scope.parseModelsFromDb();
          $scope.parsePricesFromDb();
          $scope.updateBreadcrumbs('הזמנות', 'orders', $scope.item);
          $rootScope.anyDbloading = false;
        });
      }
      $scope.updateItem = function (item, asIs) {
        if (!asIs) item = $scope.setItemVars(item);
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
        item = $scope.setItemVars(item);
        $rootScope.tempItem = item;
        $rootScope.addItemImp($scope, Orders, null, function (item) {
          $location.path('/orders/' + item._id);
        });
      }


      //piece of code for item duplication
      if ($rootScope.tempItem) {
          $scope.item = $rootScope.tempItem;
          $scope.item['_id'] = $routeParams['id'];

          $rootScope.tempItem = null;
          $timeout(function () {
            $scope.updateItem($scope.item, true);
            $scope.parseModelsFromDb();
            $scope.parsePricesFromDb();
          })
      } else {
        $scope.reloadItem({_id: $routeParams['id']});
      }

      var addId = $location.search()['addId'];

      $rootScope.filter = {};

      $scope.setItemVars = function (item) {
        item.models = $scope.parseModelsToDb();
        item.prices = $scope.parsePricesToDb();
        return item;
      }

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
          var ele = eles.findIndexById(addId, 'id');
          if ((ele>=0) && eles[ele]) {
            eles[ele].amount += 1;
          } else {
            eles.push({
              id: addId, amount: 1
            });
          }
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

        if (!$scope.item || !$scope.item.models || !$scope.models) return;

        var eles = [];
        for (var ele, e = 0; ele = $scope.models[e]; e++) {
          eles.push({
            id: ele._id, amount: ele.amount
          });
        }

        $scope.item.models = JSON.stringify(eles);
        return $scope.item.models;

      }

      $scope.parsePricesFromDb = function () {

        if (!$scope.item) return;
        if (!$scope.item.prices) $scope.item.prices = "[]";

        $scope.prices = [];
        for (var ele, e = 0; ele = $scope.currencies[e]; e++) {
          if (ele.code == 'ILS') continue; //ignore shekels
          ele.newPrice = null;
          ele.icon = 'ils';
          ele.fullname = ele.name;
          $scope.prices.push(ele);
        }
        for (var ele, e = 0; ele = $scope.materials[e]; e++) {
          ele.newPrice = null;
          ele.icon = ($rootScope.currencies.findById(ele.currency) || {}).code;
          ele.fullname = ele.name + ' (' + ($rootScope.weightUnits.findById(ele.weightUnit._id || ele.weightUnit) || {}).name + ')';
          $scope.prices.push(ele);
        }
        for (var ele, e = 0; ele = $scope.coatings[e]; e++) {
          ele.newPrice = null;
          ele.icon = ($rootScope.currencies.findById(ele.currency) || {}).code;
          ele.fullname = ele.name;
          $scope.prices.push(ele);
        }
        for (var ele, e = 0; ele = $scope.elementFeatures[e]; e++) {
          ele.newPrice = null;
          ele.icon = ($rootScope.currencies.findById(ele.currency) || {}).code;
          ele.fullname = ele.name;
          $scope.prices.push(ele);
        }

        var eles = JSON.parse($scope.item.prices);
        //format is: _id: newPrice
        for (var ele, e = 0; ele = eles[e]; e++) {
          var id = $scope.prices.findIndexById(ele.id);
          if (id < 0) continue;
          $scope.prices[id].newPrice = ele.newPrice;
        }

      }


      $scope.parsePricesToDb = function () {

        if (!$scope.item || !$scope.item.prices || !$scope.prices) return;

        var eles = [];
        for (var ele, e = 0; ele = $scope.prices[e]; e++) {
          if (ele.newPrice){
            eles.push({
              id: ele._id, newPrice: ele.newPrice
            });
          }
        }

        $scope.item.prices = JSON.stringify(eles);

        return $scope.item.prices;

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
              $scope.calcOrderCost();
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

      $scope.calcOrderCost = function () {

        if (!$scope.elements || !$scope.elements.length>0) {
          return
        }

        $scope.updateOrderQuantities();
        return $scope.elementsCost({requiredTime: $scope.totalWorkTime}, $scope.elements, $scope.prices);

      }

      $scope.calcOrderWeight = function () {

        if (!$scope.elements || !$scope.elements.length>0) return;

        return $scope.elementsWeight($scope.elements);

      }


    }]);
