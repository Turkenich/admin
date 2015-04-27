'use strict';

angular.module('adminApp')
  .controller('ElementsCtrl', ['$scope', '$rootScope', '$routeParams', '$location', '$timeout', 'Elements', 'ElementTypes', 'Materials', 'Coatings', 'ElementFeatures', 'Jewellery',
    function ($scope, $rootScope, $routeParams, $location, $timeout, Elements, ElementTypes, Materials, Coatings, ElementFeatures, Jewellery) {

      $scope.reloadItem = function (item) {
        $rootScope.reloadItemImp($scope, Elements, item);
      }
      $scope.updateItem = function (item) {
        $rootScope.updateItemImp($scope, Elements, item);
      }
      $scope.removeItem = function (item) {
        $rootScope.removeItemImp($scope, Elements, item, function(){
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
          debugger;
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

      $scope.currencies = [
        {name: "שקל", icon: "ils", _id: 'ILS'},
        {name: "דולר", icon: "usd", _id: 'USD'},
        {name: "אירו", icon: "eur", _id: 'EUR'},
        {name: "לירה שטרלינג", icon: "gbp", _id: 'GBP'},
      ]

      $scope.elementTypes = ElementTypes.all();
      $scope.materials = Materials.all();
      $scope.coatings = Coatings.all();
      $scope.elementFeatures = ElementFeatures.all();
    }]);
