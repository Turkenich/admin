'use strict';

angular.module('adminApp')
  .controller('ModelsCtrl', ['$scope', '$rootScope', '$routeParams', '$location', '$timeout', 'Elements', 'Models', 'Orders',
    function ($scope, $rootScope, $routeParams, $location, $timeout, Elements, Models, Orders) {

      $rootScope.init();

      $scope.reloadItem = function (item) {
        $rootScope.anyDbloading = true;
        $rootScope.reloadItemImp($scope, Models, item, function () {
          $scope.parseElementsFromDb();
          $scope.parsePricesFromDb();
          $scope.setmodelId();
          $scope.updateBreadcrumbs('דגמים', 'models', $scope.item);
          $rootScope.anyDbloading = false;
          console.log('Item loaded', $scope.item);
        });
      }
      $scope.updateItem = function (item, asIs) {
        if (!asIs) {
          item = $scope.setItemVars(item);
          $scope.getElementsString();
        }
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

      $scope.deleteUnnamedItems = function () {
        $scope.openModal('confirmDeleteUnnamed', function () {
          if (confirm('האם אתה בטוח שברצונך למחוק את הפריטים (זהירות בבקשה)?')) {
            var items = angular.copy($scope.items);
            for (var item, i = 0; item = items[i]; i++) {
              if (!item.name) {
                $scope.items.splice(i, 1);
                Models.remove({id: item._id});
              }
            }
          }
        });
      }

      $scope.duplicateItem = function (item) {
        item = $scope.setItemVars(item);
        $rootScope.tempItem = item;
        $rootScope.addItemImp($scope, Models, null, function (item) {
          $location.path('/models/' + item._id);
        });
      }


      //piece of code for item duplication
      if ($rootScope.tempItem) {
        $scope.item = $rootScope.tempItem;
        $scope.item['_id'] = $routeParams['id'];

        $rootScope.tempItem = null;
        $timeout(function () {
          $scope.updateItem($scope.item, true);
          $scope.parseElementsFromDb();
          $scope.parsePricesFromDb();
          $scope.setmodelId();
        })
      } else {
        $scope.reloadItem({_id: $routeParams['id']});
      }

      var addId = $location.search()['addId'];

      //when this page is opened to choose and element to add to a model
      $scope.addTo = $location.search()['addTo'];


      $rootScope.filter = {};

      $scope.setItemVars = function (item) {
        item.name = ($scope.item.modelType || "") + ($scope.item.modelId || "");
        item.elements = $scope.parseElementsToDb();
        item.prices = $scope.parsePricesToDb();
        return item;
      }

      $scope.setmodelId = function () {
        //get the next recommended id
        if (!$scope.item) return;
        if (!$scope.item.modelType || $scope.item.modelId) {
          $scope.item.recModelId = '0';
          return;
        }

        if ($routeParams['id'] && !$scope.item.modelId) {
          Models.maxId($scope.item, function (item) {
            $scope.item.recModelId = parseInt(Number(item.modelId.replace(/^\D+/g, ''))) + 1;
          });
        }
      }

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

      $scope.$watch('item.modelType', function (newVal, oldVal) {
        if (newVal && (oldVal != newVal)) {
          $scope.setmodelId();
        }
      });

      $scope.moveItem = function (ele, dir) {
        var ele1;
        if (dir > 0) ele1 = $scope.elements.findNextById(ele.pos, 'pos');
        else if (dir < 0) ele1 = $scope.elements.findPrevById(ele.pos, 'pos');


        if (ele && ele1 && ele1.pos >= 0) {
          var tmp = ele.pos;
          ele.pos = ele1.pos;
          ele1.pos = tmp;
        }

        $scope.updateItem($scope.item);

      }

      $scope.parseElementsFromDb = function () {

        if (!$scope.item) return;
        if (!$scope.item.elements) $scope.item.elements = "[]";

        var eles = JSON.parse($scope.item.elements);

        if (addId) {
          var ele = eles.findIndexById(addId, 'id');
          if ((ele >= 0) && eles[ele]) {
            eles[ele].amount += 1;
          } else {
            eles.push({
              id: addId, amount: 1, pos: eles.length
            });
          }
        }

        $scope.elements = [];
        for (var ele, e = 0; ele = eles[e]; e++) {
          Elements.query({'id': ele['id']}, function (_element) {
            _element.amount = eles.findById(_element._id, 'id').amount || 0;
            _element.pos = eles.findById(_element._id, 'id').pos || 0;
            $scope.elements.push(_element);

            if (addId && ($scope.elements.length == eles.length)) {
              $scope.updateItem($scope.item);
              addId = false;
              $location.search({'addId': null});
            }

            if (($scope.elements.length == eles.length)) {
              $scope.calcModelCost();
            }

          });
        }


      }


      $scope.parseElementsToDb = function () {

        if (!$scope.item || !$scope.item.elements || !$scope.elements) return;

        //fix position if needed
        var poss = [];
        var min_pos = 99999999;
        for (var ele, e = 0; ele = $scope.elements[e]; e++) {
          if (!(ele.pos >= 0)) ele.pos = 0;
          while (poss[ele.pos]) {//this position already exist
            ele.pos++;
          }
          if (ele.pos < min_pos) min_pos = ele.pos;
          poss[ele.pos] = true;
        }

        var eles = [];
        for (var ele, e = 0; ele = $scope.elements[e]; e++) {
          eles.push({
            id: ele._id, amount: ele.amount, pos: (ele.pos - min_pos)
          });
        }

        $scope.item.elements = JSON.stringify(eles);

        return $scope.item.elements;

      }

      $scope.getElementsString = function () {
        var arr = [];
        for (var ele, e = 0; ele = $scope.elements[e]; e++) {
          arr.push(ele.name);
        }
        $scope.item.elementsStr = arr.join(', ');
      }

      $scope.parsePricesFromDb = function () {

        if (!$scope.item) return;
        if (!$scope.item.prices) $scope.item.prices = "[]";

        $scope.prices = [];
        $scope.pricesByName = {};
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

        for (var price, e = 0; price = $scope.prices[e]; e++) {
          $scope.pricesByName[price.name] = price.newPrice || price.price;
        }

      }


      $scope.parsePricesToDb = function () {

        if (!$scope.item || !$scope.item.prices || !$scope.prices) return;

        var eles = [];
        for (var ele, e = 0; ele = $scope.prices[e]; e++) {
          if (ele.newPrice) {
            eles.push({
              id: ele._id, newPrice: ele.newPrice
            });
          }
        }

        $scope.item.prices = JSON.stringify(eles);

        return $scope.item.prices;

      }

      $scope.calcModelCost = function () {

        if (!$scope.elements || !$scope.elements.length) return;

        var cost = $scope.elementsCost($scope.item, $scope.elements, $scope.prices);

        $scope.costs = {};
        for (var c, i = 0; c = $rootScope.currenciesWithOverride[i]; i++) {
          $scope.costs[c.code] = cost / c.conversion;
        }

        $scope.item.costs = JSON.stringify($scope.costs);
        $scope.item.eTypesCosts = JSON.stringify($scope.item.eTypesCosts);

        return cost;

      }

      $scope.calcModelWeight = function () {

        if (!$scope.elements || !$scope.elements.length) return;

        var totalWeight = $scope.elementsWeight($scope.elements);

        $scope.weights = {
          total: totalWeight
        }
        var metal = '';
        var metals = [];
        for (var i in $rootScope.materialsWeight) {
          metal = $rootScope.materials.findById(i).name;
          if (!metal) continue;
          $scope.weights[metal] = $rootScope.materialsWeight[i];
          if (metals.indexOf(metal) == -1) metals.push(metal);
        }

        var stones = [];
        var stonesCost = 0;
        var stone = '';
        var patt = new RegExp(/(אבן|אבנים)/);

        for (var ele, e = 0; ele = $scope.elements[e]; e++) {
          if (!ele.name) continue;
          stone = $rootScope.elementTypes.findById(ele.elementType._id || ele.elementType).name;
          if (!stone) continue;
          if (patt.test(stone)) {
            if (stones.indexOf(ele.name) == -1) stones.push(ele.name);
            stonesCost += ele.cost;
          }
        }

        $scope.item.metals = metals.join(', ');
        $scope.item.stones = stones.join(', ');
        $scope.item.weights = JSON.stringify($scope.weights);

        return totalWeight;

      }

    }]);
