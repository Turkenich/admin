'use strict';

angular.module('adminApp')
  .controller('ElementsCtrl', ['$scope', '$rootScope', '$routeParams', '$location', '$timeout', 'Models', 'Elements',
    function ($scope, $rootScope, $routeParams, $location, $timeout, Models, Elements) {

      $rootScope.init();

      $scope.reloadItem = function (item) {
        $rootScope.anyDbloading = true;
        $rootScope.reloadItemImp($scope, Elements, item, function () {
          $scope.updateBreadcrumbs('אלמנטים', 'elements', $scope.item);
          $scope.setUnitsNames();
          $rootScope.anyDbloading = false;
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
      $scope.deleteUnnamedItems = function () {
        $scope.openModal('confirmDeleteUnnamed', function () {
          var items = angular.copy($scope.items);
          for (var item, i = 0; item = items[i]; i++) {
            if (!item.name) {
              $scope.items.splice(i, 1);
              Elements.remove({id: item._id});
            }
          }
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

      $scope.$on('measureUnitsChanged', function () {
        $scope.setUnitsNames();
      });

      $scope.measureUnitName = $scope.measureUnitOldName = 'יחידת מדידה';
      $scope.workUnitName = $scope.workUnitOldName = 'יחידת עבודה';
      $scope.setUnitsNames = function () {
        if (!$scope.item) return;
        $timeout(function () {
          var labels = $('label.control-label');
          var inputs = $('.form-control');

          $scope.measureUnitOldName = $scope.measureUnitName;
          $scope.workUnitOldName = $scope.workUnitName;

          if ($scope.item.elementType && $scope.item.elementType.measureUnit) {
            if (angular.isObject($scope.item.elementType.measureUnit)) {
              $scope.measureUnitName = $rootScope.measureUnits.findById($scope.item.elementType.measureUnit._id).name;
            } else {
              $scope.measureUnitName = $rootScope.measureUnits.findById($scope.item.elementType.measureUnit).name;
            }
          }
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
              $(label).text($(label).text().replace($scope.workUnitOldName, $scope.workUnitName));
              $(label).text($(label).text().replace($scope.measureUnitOldName, $scope.measureUnitName));
            }
            if ($(label).attr('title')) {
              $(label).attr('title', $(label).attr('title').replace($scope.workUnitOldName, $scope.workUnitName));
              $(label).attr('title', $(label).attr('title').replace($scope.measureUnitOldName, $scope.measureUnitName));
            }
          });
          inputs.each(function (i) {
            var input = inputs[i];
            if ($(input).attr('placeholder')) {
              $(input).attr('placeholder', $(input).attr('placeholder').replace($scope.workUnitOldName, $scope.workUnitName));
              $(input).attr('placeholder', $(input).attr('placeholder').replace($scope.measureUnitOldName, $scope.measureUnitName));
            }
          });
        }, 100)
      }

      //duplicate items to reach 100000 (for testing)
      $scope.duplicateForTest = function () {
        var limit = 100000;
        while ($scope.items.length < limit) {
          $scope.items = $scope.items.concat($scope.items);
        }
      };

      $scope.calcElementCost = function () {

        if (!$scope.item) return;

        var item = $scope.item;
        item.amount = 1;
        return $scope.elementsCost({requiredTime: 0}, [item], []);

      }

    }])
;
