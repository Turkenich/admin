'use strict';

angular.module('adminApp')
  .controller('RootCtrl', ['$rootScope', '$scope', '$cookies', '$sce', '$timeout', '$http', '$location', '$interval', '$modal', 'ElementTypes', 'Materials', 'Coatings', 'ElementFeatures', 'Providers', 'Prices',
    function ($rootScope, $scope, $cookies, $sce, $timeout, $http, $location, $interval, $modal, ElementTypes, Materials, Coatings, ElementFeatures, Providers, Prices) {

      console.log('VERSION: ' + '1.0');

      var pass = (localStorage['__id'] || "");

      $http.get(Consts.api_root + 'authenticate').
        success(function (data, status, headers, config) {
          $scope.authenticated = true;
          $rootScope.init();
          console.log('authenticated', data);
        }).
        error(function (data, status, headers, config) {
          $scope.authenticated = false;
        });

      $rootScope.init = function () {
        $scope.updateBreadcrumbs();
        $rootScope.elementTypes = ElementTypes.all();
        $rootScope.materials = Materials.all();
        $rootScope.providers = Providers.all();
        $rootScope.coatings = Coatings.all();
        $rootScope.elementFeatures = ElementFeatures.all();
        $rootScope.currencies = Prices.all();
      }

      $scope.logout = function () {
        localStorage['__id'] = "";
        document.location.reload();
      }

      $scope.authenticate = function () {
        localStorage['__id'] = $('input#password').val();
        document.location.reload();
      }

      $scope.alert = '';
      $scope.alertClass = '';
      $scope.showAlert = function (text, type) {
        $timeout(function () {
          $scope.alertClass = type || 'warning';
          $scope.alert = text;
          $scope.alertIsShown = true;
        });
        $timeout(function () {
          $scope.alertIsShown = false;
        }, 3000);

      }
      $scope.connected = false;
      $scope.waitForConnection = $interval(function () {
        $http.get(Consts.api_root + 'ping').
          success(function (data, status, headers, config) {
            $('.loader').css('opacity', 0);
            $interval.cancel($scope.waitForConnection);
            $timeout(function () {
              $('.loader').remove();
            }, 2000);
          }).
          error(function (data, status, headers, config) {
          });
      }, 3000);


      $scope.updateBreadcrumbs = function (name, path, item) {
        $rootScope.location = path;
        $rootScope.breadcrumbs = [{name: 'ראשי', link: '#/'}];
        if (!name || !path) return;
        $rootScope.breadcrumbs.push({
          name: name, link: '#/' + path
        });
        if (item) {
          $rootScope.breadcrumbs.push({
            name: (item.code || item.name || item.desc), link: '#/' + path + '/' + item._id
          });
        }
      }

      $scope.goBack = function (delay) {
        $timeout(function () {
          var path = $location.path().split('/');
          path.splice(path.length - 1, 1);
          $location.path(path.join('/'));
          //window.history.back();
        }, (delay || 0))
      }
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
          $('.ng-dirty').removeClass('ng-dirty');
          $scope.showAlert('הפריט נשמר בהצלחה');
          if (angular.isFunction(callback)) callback(_item);
        });
      }
      $rootScope.removeItemImp = function (scope, Model, item, callback) {
        $scope.openModal('confirmDelete', function () {
          if (confirm('האם אתה בטוח שברצונך למחוק את הפריט?')) {
            console.log('deleting', item);
            Model.remove({id: item._id}, function () {
              $scope.showAlert('הפריט נמחק בהצלחה');
              if (angular.isFunction(callback)) callback(item);
            });
            if (scope.items && scope.items.length > 0) {
              var i = scope.items.findIndexById(item._id);
              scope.items.splice(i, 1);
            }
          }
        }, function () {
          console.log('CANCELED')
        });
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
        debugger
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

      $rootScope.sort = 'name';
      $rootScope.sortBy = function (name) {
        $rootScope.sort = name;
      }
      $rootScope.isSortedBy = function (name) {
        return $rootScope.sort == name;
      }

      $rootScope.location = 'main';
      $rootScope.locationIs = function (name) {
        return $rootScope.location == name;
      }

      $scope.openModal = function (template, ok, cancel) {
        var modalInstance = $modal.open({
          animation: true,
          templateUrl: 'views/partials/' + template + '.html',
          controller: 'ModalInstanceCtrl',
          resolve: {
            ok: function () {
              return ok;
            },
            cancel: function () {
              return cancel;
            }
          }
        });
      }


      $scope.noimage = 'images/noimage.jpg';

      $rootScope.showUploader = false;
      $rootScope.displayUploader = function (status) {
        $rootScope.showUploader = status;
      }

      $rootScope.measureUnits = [
        {name: "גרם", _id: 'gram'},
        {name: "סנטימטר", _id: 'centimeter'},
        {name: "יחידה", _id: 'unit'},
      ]


      $scope.elementsCost = function (model, elements, prices) {

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
            var override = (prices.findById(material._id));
            if (override && override.newPrice) {
              materialPrice = (override.newPrice) / Consts.OunceToGrams;
            }

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
          var workUnitCurrency = $scope.currencies.findById(ele.workUnitCurrency);
          var workUnitPrice = ele.workUnitPrice * (workUnitCurrency.conversion || 0);
          override = (prices.findById(workUnitCurrency._id));
          if (override && override.newPrice) {
            workUnitPrice = ele.workUnitPrice * (override.newPrice || 0);
          }
          var workUnit = ele.workUnit;
          if (workUnit == 'gram') {
            $scope.providerWorkCost += eleWeight * ele.amount * workUnitPrice;
          } else {
            $scope.providerWorkCost += ele.amount * workUnitPrice || 0;
          }

        }
        //add work time
        var workTime = model.requiredTime || 0;
        var minutePrice = ($scope.currencies.findById('TIME', 'code').conversion || 0);
        override = (prices.findById('TIME', 'code'));
        if (override && override.newPrice) {
          minutePrice = (override.newPrice || 0);
        }

        $scope.workCost = (minutePrice || 0) * workTime;


        //Calc Total Cost

        $scope.workCost = Math.round($scope.workCost * 100) / 100;
        $scope.providerWorkCost = Math.round($scope.providerWorkCost * 100) / 100;
        $scope.elementFeatureCost = Math.round($scope.elementFeatureCost * 100) / 100;
        $scope.coatingCost = Math.round($scope.coatingCost * 100) / 100;
        $scope.materialCost = Math.round($scope.materialCost * 100) / 100;

        cost = $scope.workCost + $scope.providerWorkCost + $scope.elementFeatureCost + $scope.coatingCost + $scope.materialCost;

        return cost;
      }

      $scope.$on('$locationChangeEnd', function (event) {
        $('.navbar-collapse.collapse').removeClass('in');
      });

    }]);
