'use strict';

angular.module('adminApp')
  .controller('ElementsCtrl', ['$scope', '$routeParams', 'Elements', 'ElementTypes', 'Materials', 'Coatings', 'ElementFeatures', 'Jewellery',
    function ($scope, $routeParams, Elements, ElementTypes, Materials, Coatings, ElementFeatures, Jewellery) {

    if ($routeParams['id']) {
      $scope.item = Elements.query({'id': $routeParams['id']});
    } else {
      $scope.items = Elements.all();
    }
    $scope.updateItem = function () {
      console.log('updating', $scope.item);
      $scope.item.$update();
    }
    $scope.removeItem = function (item) {
      if (confirm('Are You Sure???')) {
        console.log('deleting', item);
        var i = $scope.items.findIndexById(item._id);
        Elements.remove({id: item._id});
        $scope.items.splice(i, 1);
      }
    }
    $scope.addItem = function () {
      Elements.create(function (item) {
        Elements.query({id: item._id}, function (item) {
          $scope.items.push(item);
        });
      });
    }

    $scope.measureUnits = [
      {name: "גרם", _id: 'gram'},
      {name: "סנטימטר", _id: 'centimeter'},
      {name: "יחידה", _id: 'unit'},
    ]
    $scope.currencies = [
      {name: "שקל", icon:"ils", _id: 'ILS'},
      {name: "דולר", icon:"usd", _id: 'USD'},
      {name: "אירו", icon:"eur", _id: 'EUR'},
      {name: "לירה שטרלינג", icon:"gbp", _id: 'GBP'},
    ]

    $scope.elementTypes = ElementTypes.all();
    $scope.materials = Materials.all();
    $scope.coatings = Coatings.all();
    $scope.elementFeatures = ElementFeatures.all();
  }]);
