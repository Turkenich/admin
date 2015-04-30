'use strict';

angular.module('adminApp')
  .controller('RootCtrl', ['$rootScope', '$scope', '$sce', function ($rootScope, $scope, $sce) {

    console.log('VERSION: ' + '1.0');

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


    $scope.measureUnits = [
      {name: "גרם", _id: 'gram'},
      {name: "סנטימטר", _id: 'centimeter'},
      {name: "יחידה", _id: 'unit'},
    ]


  }]);
