'use strict';

angular.module('adminApp')
  .controller('ElementsCtrl', ['$scope', '$rootScope', '$routeParams', '$location', '$timeout', 'Models', 'Elements',
    function ($scope, $rootScope, $routeParams, $location, $timeout, Models, Elements) {

      $scope.reloadItem = function (item) {
        $rootScope.reloadItemImp($scope, Elements, item, function () {
          $scope.updateBreadcrumbs('אלמנטים', 'elements', $scope.item);
        });
      }
      $scope.updateItem = function (item) {
        $rootScope.updateItemImp($scope, Elements, item);
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
              name: model.modelCode || model.desc,
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

      //duplicate items to reach 10000 (for testing)
      $scope.duplicateForTest = function () {
        var limit = 1000000;
        while ($scope.items.length < limit) {
          $scope.items = $scope.items.concat($scope.items);
        }
      };


    }]);
