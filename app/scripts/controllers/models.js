'use strict';

angular.module('adminApp')
  .controller('ModelsCtrl', ['$scope', '$rootScope', '$routeParams', '$location', '$timeout', 'Elements', 'Models', 'Orders', 'ElementTypes', 'Materials', 'Coatings', 'ElementFeatures', 'Providers', 'Prices',
    function ($scope, $rootScope, $routeParams, $location, $timeout, Elements, Models, Orders, ElementTypes, Materials, Coatings, ElementFeatures, Providers, Prices) {

      $scope.reloadItem = function (item) {
        $rootScope.reloadItemImp($scope, Models, item, function () {
          $scope.parseElementsFromDb();
          $scope.updateBreadcrumbs('דגמים', 'models', $scope.item);
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

      //when this page is opened to choose and element to add to a model
      $scope.addTo = $location.search()['addTo'];


      $rootScope.filter = {};

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

      Orders.all(function (orders) {
        $scope.orders = [];
        for (var order, i = 0; order = orders[i]; i++) {
          if (!order.models) continue;
          var _order = {
            name: order.name || order.desc,
          }
          var id = parseOrderModels(order.models);
          id.unshift(order._id);
          _order._id = JSON.stringify(id);

          $scope.orders.push(_order);
        }
        function parseOrderModels(models) {
          var eles = JSON.parse(models);
          var res = [];
          for (var ele, e = 0; ele = eles[e]; e++) {
            res.push(ele['id']);
          }
          return res
        }
      });


      $scope.materials = Materials.all();
      $scope.coatings = Coatings.all();
      $scope.elementFeatures = ElementFeatures.all();
      $scope.prices = Prices.all();

      //private
      $scope.parseElementsFromDb = function () {

        if (!$scope.item) return;
        if (!$scope.item.elements) $scope.item.elements = "[]";

        var eles = JSON.parse($scope.item.elements);

        if (addId) {
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

            if (($scope.elements.length == eles.length)) {
              $scope.modelCost();
            }

          });
        }


      }


      $scope.parseElementsToDb = function () {

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

      $scope.modelCost = function () {

        if (!$scope.elements || !$scope.elements.length) return;

        var elements = $scope.elements;

        debugger;

        var cost = 0;
        $scope.workCost = 0;
        $scope.providerWorkCost = 0;
        $scope.elementFeatureCost = 0;
        $scope.coatingCost = 0;
        $scope.materialCost = 0;

        //calc each element costs (material, work, waste, currency)
        for (var ele, e = 0; ele = elements[e]; e++) {

          //get ele weight in grams
          var eleWeight = (ele.measureUnitWeight || 0) / (1 - (ele.waste || 0));

          //material cost
          if ($scope.materials) {
            var material = $scope.materials.findById(ele.material);
            //get material price for gram
            var materialPrice = (material.price || 0) / Consts.OunceToGrams;

            //add to cost
            $scope.materialCost += eleWeight * ele.amount * materialPrice;
          }
          //coating cost
          if ($scope.coatings) {
            var coating = $scope.coatings.findById(ele.coating);
            //get measure unit of the coating
            var measureUnit = coating.measureUnit;

            //get coating price per measure unit
            var coatingPrice = coating.price;

            //add to cost
            if (measureUnit == 'gram') {
              $scope.coatingCost += eleWeight * ele.amount * coatingPrice;
            } else {
              $scope.coatingCost += ele.amount * coatingPrice || 0;
            }
          }
          //elementFeatures cost
          if ($scope.elementFeatures) {
            var elementFeature = $scope.elementFeatures.findById(ele.elementFeature);
            //get measure unit of the elementFeature
            var measureUnit = elementFeature.measureUnit;

            //get elementFeature price per measure unit
            var elementFeaturePrice = elementFeature.price || 0;

            //add to cost
            if (measureUnit == 'gram') {
              $scope.elementFeatureCost += eleWeight * ele.amount * elementFeaturePrice;
            } else {
              $scope.elementFeatureCost += ele.amount * elementFeaturePrice;
            }
          }
          //work cost

          //get the work cost per unit in ILS
          var workUnitPrice = ele.workUnitPrice * (($scope.prices.findById(ele.workUnitCurrency) || {}).conversion || 0);

          var workUnit = ele.workUnit;
          if (workUnit == 'gram') {
            $scope.providerWorkCost += eleWeight * ele.amount * workUnitPrice;
          } else {
            $scope.providerWorkCost += ele.amount * workUnitPrice || 0;
          }

        }
        //add work time
        var workTime = $scope.item.requiredTime || 0;
        var minutePrice = ($scope.prices.findById('TIME', 'code').conversion || 0);

        $scope.workCost = (minutePrice || 0) * workTime;


        //Calc Total Cost
        cost = $scope.workCost + $scope.providerWorkCost + $scope.elementFeatureCost + $scope.coatingCost + $scope.materialCost;

        return cost;
      }

    }]);
