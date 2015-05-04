'use strict';

angular.module('adminApp')
  .controller('ElementsCtrl', ['$scope', '$rootScope', '$routeParams', '$location', '$timeout', 'Models', 'Elements',
    function ($scope, $rootScope, $routeParams, $location, $timeout, Models, Elements) {

      $scope.reloadItem = function (item) {
        $rootScope.reloadItemImp($scope, Elements, item, function () {
          $scope.updateBreadcrumbs('אלמנטים', 'elements', $scope.item);
          $scope.setUnitsNames();
        });
      }
      $scope.updateItem = function (item) {
        $rootScope.updateItemImp($scope, Elements, item, function () {
          $scope.setUnitsNames();
        });
      }
      $scope.removeItem = function (item) {
        $rootScope.removeItemImp($scope, Elements, item, function () {
          $location.path('/elements');
        });
      }
      $scope.addItem = function (item) {
        $rootScope.addItemImp($scope, Elements, null, function (item) {
          $location.path('/elements/' + item._id);
        });
      }

      $scope.duplicateItem = function (item) {
        $rootScope.tempItem = item;
        $rootScope.addItemImp($scope, Elements, null, function (item) {
          $location.path('/elements/' + item._id);
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

      //when this page is opened to choose and element to add to a model
      $scope.addTo = $location.search()['addTo'];


      $rootScope.filter = {};

      if (!$routeParams['id']) {
        //only fetch models on elements screen (used for filtering)
        Models.all(function (models) {
          $scope.models = [];
          for (var model, i = 0; model = models[i]; i++) {
            if (!model.elements) continue;
            var _model = {
              name: model.modelCode || model.desc
            }
            var id = parseModelElements(model.elements);
            id.unshift(model._id);
            _model._id = JSON.stringify(id);

            $scope.models.push(_model);
          }
          function parseModelElements(elements) {
            var eles = JSON.parse(elements);
            var res = [];
            for (var ele, e = 0; ele = eles[e]; e++) {
              res.push(ele['id']);
            }
            return res
          }
        });
      }

      $scope.setUnitsNames = function () {
        $timeout(function () {
          var labels = $('label.control-label');
          var inputs = $('.form-control');
          $scope.measureUnitName = 'יחידת מדידה';
          if ($scope.item.elementType && $scope.item.elementType.measureUnit) {
            if (angular.isObject($scope.item.elementType.measureUnit)) {
              $scope.measureUnitName = $rootScope.measureUnits.findById($scope.item.elementType.measureUnit._id).name;
            } else {
              $scope.measureUnitName = $rootScope.measureUnits.findById($scope.item.elementType.measureUnit).name;
            }
          }
          $scope.workUnitName = 'יחידת עבודה';
          if ($scope.item.workUnit && $scope.item.workUnit._id) {
            if (angular.isObject($scope.item.workUnit)) {
              $scope.workUnitName = $rootScope.measureUnits.findById($scope.item.workUnit._id).name;
            } else {
              $scope.workUnitName = $rootScope.measureUnits.findById($scope.item.workUnit).name;
            }
          }
          labels.each(function (i) {
            var label = labels[i];
            if ($(label).text()) {
              $(label).text($(label).text().replace('יחידת עבודה', $scope.workUnitName));
              $(label).text($(label).text().replace('יחידת מדידה', $scope.measureUnitName));
            }
            if ($(label).attr('title')) {
              $(label).attr('title', $(label).attr('title').replace('יחידת עבודה', $scope.workUnitName));
              $(label).attr('title', $(label).attr('title').replace('יחידת מדידה', $scope.measureUnitName));
            }
          });
          inputs.each(function (i) {
            var input = inputs[i];
            if ($(input).attr('placeholder')) {
              $(input).attr('placeholder', $(input).attr('placeholder').replace('יחידת עבודה', $scope.workUnitName));
              $(input).attr('placeholder', $(input).attr('placeholder').replace('יחידת מדידה', $scope.measureUnitName));
            }
          });
        }, 1000)
      }

      //duplicate items to reach 10000 (for testing)
      $scope.duplicateForTest = function () {
        var limit = 100000;
        while ($scope.items.length < limit) {
          $scope.items = $scope.items.concat($scope.items);
        }
      };


    }])
;
