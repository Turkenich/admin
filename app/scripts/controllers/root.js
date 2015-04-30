'use strict';

angular.module('adminApp')
  .controller('RootCtrl', ['$rootScope', '$scope', '$sce', 'ElementTypes', 'Materials', 'Coatings', 'ElementFeatures', 'Providers', 'Prices',
    function ($rootScope, $scope, $sce, ElementTypes, Materials, Coatings, ElementFeatures, Providers, Prices) {

    console.log('VERSION: ' + '1.0');

    $scope.updateBreadcrumbs = function(name, path, item){
      $rootScope.breadcrumbs = [{name: 'ראשי', link: '#/'}];
      if (!name || !path) return;
      $rootScope.breadcrumbs.push({
        name: name, link: '#/' + path
      });
      if (item){
        $rootScope.breadcrumbs.push({
          name: (item.code || item.name || item.desc), link: '#/' + path + '/' + item._id
        });
      }
    }
    $scope.updateBreadcrumbs();

    $scope.trustUrl = function (url) {
      return $sce.trustAsResourceUrl(url);
    }

    $rootScope.reloadItemImp = function (scope, Model, item, callback) {
      if (item && item['_id']) {
        scope.item = Model.query({'id': item['_id']}, function () {
          if (angular.isFunction(callback)) callback(scope.item);
        });
      } else {
        scope.items = Model.all({}, function () {
          if (angular.isFunction(callback)) callback(scope.items);
        });
      }
    }

    $rootScope.updateItemImp = function (scope, Model, item, callback) {
      console.log('updating', item);
      Model.update(item, function (_item) {
        console.log('updated', _item);
        if (angular.isFunction(callback)) callback(_item);
      });
    }
    $rootScope.removeItemImp = function (scope, Model, item, callback) {
      if (confirm('Are You Sure???')) {
        console.log('deleting', item);
        Model.remove({id: item._id}, function () {
          if (angular.isFunction(callback)) callback(item);
        });
        if (scope.items && scope.items.length > 0) {
          var i = scope.items.findIndexById(item._id);
          scope.items.splice(i, 1);
        }
      }
    }
    $rootScope.addItemImp = function (scope, Model, item, callback) {
      if (item) {
        Model.create(item, function (item) {
          if (angular.isFunction(callback)) callback(item);
        });
      } else {
        Model.create(function (item) {
          if (angular.isFunction(callback)) callback(item);
        });
      }
    }

    $rootScope.moveItemImp = function (scope, Model, items, item, dir, callback) {
      //var index = items.findIndexById(item._id, '_id');
      if (dir > 0) var item1 = items.findNextById(item.pos, 'pos');
      else if (dir < 0) var item1 = items.findPrevById(item.pos, 'pos');

      if (item && item1) {
        var tmp = item.pos;
        item.pos = item1.pos;
        item1.pos = tmp;
        $rootScope.updateItemImp(scope, Model, item, callback);
        $rootScope.updateItemImp(scope, Model, item1, callback);
      }
    }

    $scope.clearForm = function () {
      $('.form-control').val('').text('');
      $rootScope.filter = {};
    }


    $scope.elementTypes = ElementTypes.all();
    $scope.materials = Materials.all();
    $scope.providers = Providers.all();
    $scope.coatings = Coatings.all();
    $scope.elementFeatures = ElementFeatures.all();
    $scope.prices = Prices.all();

    $scope.measureUnits = [
      {name: "גרם", _id: 'gram'},
      {name: "סנטימטר", _id: 'centimeter'},
      {name: "יחידה", _id: 'unit'},
    ]


    $scope.elementsCost = function (model, elements) {

      if (!elements || !elements.length) return;

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
      var workTime = model.requiredTime || 0;
      var minutePrice = ($scope.prices.findById('TIME', 'code').conversion || 0);

      $scope.workCost = (minutePrice || 0) * workTime;


      //Calc Total Cost
      cost = $scope.workCost + $scope.providerWorkCost + $scope.elementFeatureCost + $scope.coatingCost + $scope.materialCost;

      return cost;
    }



  }]);
