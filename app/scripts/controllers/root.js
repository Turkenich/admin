'use strict';

angular.module('adminApp')
  .controller('RootCtrl', ['$rootScope', '$scope', '$cookies', '$sce', '$timeout', '$http', '$location', '$window', '$interval', '$modal', 'ElementTypes', 'Materials', 'Coatings', 'ElementFeatures', 'Providers', 'Prices',
    function ($rootScope, $scope, $cookies, $sce, $timeout, $http, $location, $window, $interval, $modal, ElementTypes, Materials, Coatings, ElementFeatures, Providers, Prices) {

      $rootScope.version = 'GRUNT_VERSION';
      console.log('VERSION: ' + $rootScope.version);

      $rootScope.exportType = '';

      $scope.authenticate = function () {
        $http.get(Consts.api_root + 'authenticate').
          success(function (data, status, headers, config) {
            $scope.authenticated = true;
            $rootScope.init();
            console.log('authenticated', data);
          }).
          error(function (data, status, headers, config) {
            $scope.authenticated = false;
          });
      }

      $rootScope.dbloading = false;
      $rootScope.checkDdbloading = function () {
        $rootScope.elementTypes.$promise.then(function () {
          yo('loading elementTypes', $rootScope.elementTypes);
          $rootScope.dbloading = false;
        });
        $rootScope.materials.$promise.then(function () {
          yo('loading materials', $rootScope.materials);
          $rootScope.dbloading = false;
        });
        $rootScope.providers.$promise.then(function () {
          yo('loading providers', $rootScope.providers);
          $rootScope.dbloading = false;
        });
        $rootScope.coatings.$promise.then(function () {
          yo('loading coatings', $rootScope.coatings);
          $rootScope.dbloading = false;
        });
        $rootScope.elementFeatures.$promise.then(function () {
          yo('loading elementFeatures', $rootScope.elementFeatures);
          $rootScope.dbloading = false;
        });
        $rootScope.currencies.$promise.then(function () {
          yo('loading currencies', $rootScope.currencies);
          $rootScope.dbloading = false;
        });
        if ($rootScope.anyDbloading) {
          $rootScope.dbloading = false;
        }
        $rootScope.dbloading = true;
      }

      $rootScope.init = function () {

        console.log('rootScope init');

        $scope.updateBreadcrumbs();
        $rootScope.saving = false;
        $rootScope.elementTypes = ElementTypes.all();
        $rootScope.materials = Materials.all();
        $rootScope.providers = Providers.all();
        $rootScope.coatings = Coatings.all();
        $rootScope.elementFeatures = ElementFeatures.all();
        $rootScope.currencies = Prices.all(function (currencies) {
          $rootScope.currencies = currencies;
          $rootScope.coins = [];
          for (var i = 0; i < currencies.length; i++) {
            if (currencies[i].code == 'TIME') continue;
            $rootScope.coins.push(currencies[i]);
          }
        });
        $rootScope.checkDdbloading();
      }

      $rootScope.measureUnits = [
        {name: "גרם", _id: 'gram'},
        {name: "סנטימטר", _id: 'centimeter'},
        {name: "יחידה", _id: 'unit'},
      ]

      $rootScope.weightUnits = [
        {name: "אונקייה", _id: 'ounce', grams: 31.104},
        {name: "גרם", _id: 'gram', grams: 1},
        {name: "קילוגרם", _id: 'kilo', grams: 1000},
      ]

      $scope.logout = function () {
        localStorage['Authorization'] = "";
        document.location.reload();
      }

      $scope.changePassword = function () {
        localStorage['Authorization'] = md5($('input#password').val());
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
            $scope.authenticate();
            $timeout(function () {
              $('.loader').remove();
            }, 2000);
          }).
          error(function (data, status, headers, config) {
          });
      }, 2000);


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

      $scope.setSaving = function (val) {
        $rootScope.saving = val;
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

      $scope.getFromJson = function (str, id) {
        if (!str || !str.isJson) {
          return '';
        }
        var tot = 0;
        var jsn = JSON.parse(str);
        for (var i in jsn){
          if (!jsn.hasOwnProperty(i)) return;
          if (i.indexOf(id) >= 0){
            tot += Number(jsn[id]);
          }
        }
        return tot;
      }

      $scope.spreadJson = function (str) {
        if (!str || !str.isJson) {
          return '';
        }
        var flds = {};
        var jsn = JSON.parse(str);
        for (var i in jsn){
          if (!jsn.hasOwnProperty(i)) return;
          flds[i] = true;
        }
        var spread = [];
        for (var i in flds){
          if (!flds.hasOwnProperty(i)) return;
          spread.push(i);
        }
        console.log('spread', spread);
        return spread;
      }

      $scope.spreadJsons = function (parent, field) {
        var flds = {};

        for (var child, c=0; child = parent[c]; c++) {
          var str = child[field];
          if (!str || !str.isJson) {
            continue;
          }
          var jsn = JSON.parse(str);
          for (var i in jsn) {
            if (!jsn.hasOwnProperty(i)) return;
            flds[i] = true;
          }
        }
        var spread = [];
        for (var i in flds){
          if (!flds.hasOwnProperty(i)) return;
          spread.push(i);
        }
        console.log('spreads', spread);
        return spread;
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
          if ($rootScope.saving) {
            $scope.setSaving('false');
            window.history.back();
          }
        }, function () {
          $scope.showAlert('אירעה שגיאה בשמירת הפריט - נא לנסות שנית');
          $scope.setSaving('false');
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

      $rootScope.getPopulatedItemImp = function (scope, Model, item, callback) {
        Model.query({'id': item['_id']}, function (item) {
          if (angular.isFunction(callback)) callback(item);
        });
      }

      $scope.exportToCsv = function (item, title) {
        $scope.exportJson(item, 'element', true);
        //$rootScope.getPopulatedItemImp($scope, Elements, item, function (item) {
        //});
      }

      $scope.clearForm = function () {
        $('.form-control').val('').text('');
        $rootScope.filter = {};
      }

      $rootScope.sort = 'name';
      $rootScope.desc = false;
      $rootScope.sortBy = function (name) {
        $rootScope.sort = name;
        $rootScope.desc = !(name == 'name');
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
          templateUrl: 'views/partials/' + template + '.html?v=' + $rootScope.version,
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


      $scope.elementsCost = function (model, elements, prices) {

        if (!elements || !elements.length) return;

        //console.log('calculating cost...');

        var cost = 0;
        var eleCost = 0;

        var providerWorkCost = 0;
        var elementFeatureCost = 0;
        var coatingCost = 0;
        var materialCost = 0;

        $rootScope.workCost = 0;
        $rootScope.providerWorkCost = 0;
        $rootScope.elementFeatureCost = 0;
        $rootScope.coatingCost = 0;
        $rootScope.materialCost = 0;
        $rootScope.materialsCost = {};

        var override;
        var currencies = [];
        for (var c, i = 0; c = $scope.currencies[i]; i++) {
          currencies.push(c);
          override = (prices.findById(c._id || c));
          if (override.newPrice) {
            currencies[currencies.length - 1].conversion = parseInt(override.newPrice);
          }
        }
        $rootScope.currenciesWithOverride = currencies;

        var materialsCost = {};
        model.eTypesCosts = {};

        //calc each element costs (material, work, waste, currency)
        for (var ele, e = 0; ele = elements[e]; e++) {

          //get ele weight in grams
          var eleWeight = (ele.measureUnitWeight || 0);
          var eleWeightIncludingWaste = (ele.measureUnitWeight || 0) / (1 - (ele.waste / 100 || 0));

          //material cost
          if ($rootScope.materials && ele.material) {
            var material = $rootScope.materials.findById(ele.material._id || ele.material);
            //get material price for gram
            var materialPrice = (material.price || 0);
            var materialWeight = ($rootScope.weightUnits.findById(material.weightUnit) || {}).grams || 1;
            var materialConversion = currencies.findById(material.currency).conversion || 0;

            override = (prices.findById(material._id));
            if (override && override.newPrice) {
              materialPrice = parseInt(override.newPrice);
            }

            //add to cost
            materialCost = eleWeightIncludingWaste * ele.amount * (materialPrice * materialConversion / materialWeight); //waste affects only the material calc

            materialCost = parseInt(materialCost * 100) / 100;
            $rootScope.materialCost += materialCost;
            if (!materialsCost[material._id]) {
              materialsCost[material._id] = materialCost;
            } else {
              materialsCost[material._id] += materialCost;
            }
          }
          //coating cost
          if ($rootScope.coatings && ele.coating) {
            var coating = $rootScope.coatings.findById(ele.coating._id || ele.coating);
            //get measure unit of the coating
            var coatingMeasureUnit = coating.measureUnit;
            var coatingPrice = (coating.price || 0);
            var coatingConversion = currencies.findById(coating.currency).conversion || 0;

            override = (prices.findById(coating._id));
            if (override && override.newPrice) {
              coatingPrice = parseInt(override.newPrice);
            }

            //add to cost
            if (coatingMeasureUnit == 'gram') {
              coatingCost = eleWeight * ele.amount * coatingPrice * coatingConversion;
            } else {
              coatingCost = ele.amount * coatingPrice * coatingConversion;
            }
            $rootScope.coatingCost += coatingCost;
          }
          //elementFeatures cost
          if ($rootScope.elementFeatures && ele.elementFeature) {
            var elementFeature = $rootScope.elementFeatures.findById(ele.elementFeature._id || ele.elementFeature);
            //get measure unit of the elementFeature
            var elementFeatureMeasureUnit = elementFeature.measureUnit;
            var elementFeaturePrice = (elementFeature.price || 0);
            var elementFeatureConversion = currencies.findById(elementFeature.currency).conversion || 0;

            override = (prices.findById(elementFeature._id));
            if (override && override.newPrice) {
              elementFeaturePrice = parseInt(override.newPrice);
            }

            //add to cost
            if (elementFeatureMeasureUnit == 'gram') {
              elementFeatureCost = eleWeight * ele.amount * elementFeaturePrice * elementFeatureConversion;
            } else {
              elementFeatureCost = ele.amount * elementFeaturePrice * elementFeatureConversion;
            }
            $rootScope.elementFeatureCost += elementFeatureCost;
          }
          //work cost

          //get the work cost per unit in ILS
          if ($rootScope.currencies && ele.workUnitCurrency) {
            var workUnitCurrency = $rootScope.currencies.findById(ele.workUnitCurrency._id || ele.workUnitCurrency);
            var workUnitPrice = ele.workUnitPrice * (workUnitCurrency.conversion || 0);
            override = (prices.findById(workUnitCurrency._id));
            if (override && override.newPrice) {
              workUnitPrice = ele.workUnitPrice * (override.newPrice || 0);
            }
            var workUnit = ele.workUnit;
            if (workUnit == 'gram') {
              providerWorkCost = eleWeight * ele.amount * workUnitPrice;
            } else {
              providerWorkCost = ele.amount * workUnitPrice || 0;
            }
            $rootScope.providerWorkCost += providerWorkCost;

          }

          //save cost by elementType
          eleCost = parseInt((providerWorkCost + elementFeatureCost + coatingCost + materialCost) * 100) / 100;

          if (ele.elementType) {
            var elementType = ($rootScope.elementTypes.findById(ele.elementType._id || ele.elementType) || {}).name;
            if (!model.eTypesCosts[elementType]) {
              model.eTypesCosts[elementType] = eleCost;
            } else {
              model.eTypesCosts[elementType] += eleCost;
            }
          }

        }

        //add work time
        var workTime = model.requiredTime || 0;
        var minutePrice = ($scope.currencies.findById('TIME', 'code').conversion || 0);
        override = (prices.findById('TIME', 'code'));
        if (override && override.newPrice) {
          minutePrice = (override.newPrice || 0);
        }

        $rootScope.workCost = (minutePrice || 0) * workTime;


        //Calc Total Cost
        $rootScope.workCost = parseInt($rootScope.workCost * 100) / 100;
        $rootScope.providerWorkCost = parseInt($rootScope.providerWorkCost * 100) / 100;
        $rootScope.elementFeatureCost = parseInt($rootScope.elementFeatureCost * 100) / 100;
        $rootScope.coatingCost = parseInt($rootScope.coatingCost * 100) / 100;
        $rootScope.materialCost = parseInt($rootScope.materialCost * 100) / 100;
        $rootScope.materialsCost = materialsCost;

        cost = parseInt(($rootScope.workCost + $rootScope.providerWorkCost + $rootScope.elementFeatureCost + $rootScope.coatingCost + $rootScope.materialCost) * 100) / 100;

        return cost;

      }

      $scope.elementsWeight = function (elements) {

        if (!elements || !elements.length) return;

        var materialsWeight = {};
        $rootScope.materialsWeight = {};

        //console.log('calculating weight...');

        var weight = 0;
        var totWeight = 0;

        //calc each element weight
        for (var ele, e = 0; ele = elements[e]; e++) {
          //get ele weight in grams
          weight = parseInt(ele.amount * (ele.measureUnitWeight || 0) * 100) / 100;

          var material = $rootScope.materials.findById(ele.material);
          if (!materialsWeight[material._id]) {
            materialsWeight[material._id] = weight;
          } else {
            materialsWeight[material._id] += weight;
          }
          totWeight += weight;
        }

        $rootScope.materialsWeight = materialsWeight;

        return totWeight;
      }

      $scope.$on('$locationChangeEnd', function (event) {
        $('.navbar-collapse.collapse').removeClass('in');
      });

      $scope.exportJson = function (JSONData, ReportTitle, ShowLabel) {
        //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
        var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
        arrData = typeof arrData != 'Array' ? [arrData] : arrData;

        var CSV = '';
        //Set Report title in first row or line

        CSV += ReportTitle + '\r\n\n';

        //This condition will generate the Label/Header
        if (ShowLabel) {
          var row = "";

          //This loop will extract the label from 1st index of on array
          for (var index in arrData[0]) {

            if ((index.charAt(0) == '_' || index.charAt(0) == '$')) continue;

            //Now convert each value to string and comma-seprated
            row += index + ',';
          }

          row = row.slice(0, -1);

          //append Label row with line break
          CSV += row + '\r\n';
        }

        //1st loop is to extract each row
        var val;
        for (var i = 0; i < arrData.length; i++) {
          var row = "";

          //2nd loop will extract each column and convert it in string comma-seprated
          for (var index in arrData[i]) {
            val = arrData[i][index];
            if (angular.isFunction(val)) continue;
            else if ((index.charAt(0) == '_' || index.charAt(0) == '$')) continue;
            else if (angular.isObject(val)) {
              val = val.name || val.desc;
            }


            row += '"' + val + '",';
          }

          row.slice(0, row.length - 1);

          //add a line break after each row
          CSV += row + '\r\n';
        }

        if (CSV == '') {
          alert("Invalid data");
          return;
        }

        //Generate a file name
        var fileName = "MyReport_";
        //this will remove the blank-spaces from the title and replace it with an underscore
        fileName += ReportTitle.replace(/ /g, "_");

        //Initialize file format you want csv or xls
        var uri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(CSV);

        // Now the little tricky part.
        // you can use either>> window.open(uri);
        // but this will not work in some browsers
        // or you will not get the correct file extension

        //this trick will generate a temp <a /> tag
        var link = document.createElement("a");
        link.href = uri;

        //set the visibility hidden so it will not effect on your web-layout
        link.style = "visibility:hidden";
        link.download = fileName + ".csv";

        //this part will append the anchor tag and remove it after automatic click
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      $rootScope.copiedTable = -1;
      $rootScope.exportTables = [];
      $rootScope.setCopiedTable = function (i) {
        $rootScope.watingTable = i;
      }
      $rootScope.getExportTables = function () {

        $rootScope.copiedTable = -1;

        var res = [];
        $.each($('.export-table'), function (i, table) {
          res.push({
            name: $(table).attr('title'),
            target: $(table).attr('data-target'),
          })
          $rootScope.exportTables = res;
        })
        $rootScope.exportTables = res;
      }
      $rootScope.newSpreadsheet = function () {
        $window.open('http://spreadsheets.google.com/ccc?new&hl=he');
      }

      $rootScope.getHtmlToCopy = function (target, idx) {

        $rootScope.copiedTable = -1;
        $rootScope.waitingTable = idx;


        function $chk(obj) {
          return !!(obj || obj === 0)
        }

        var copyConst = {rowSeperator: "\r\n", colSeperator: "\t"}

        var TableUtil = {
          nodeToString: function (table, rowSeperator, colSeperator) {
            var d = "";
            try {
              if (table.childNodes.length) {
                if ("TD" == table.nodeName || "TH" == table.nodeName) {
                  colSeperator = rowSeperator = "";
                }
                for (table = table.firstChild; table;) {
                  d += TableUtil.nodeToString(table, rowSeperator, colSeperator);
                  if ("TR" == table.nodeName) {
                    d += rowSeperator;
                  } else if ("TD" == table.nodeName || "TH" == table.nodeName) {
                    d += colSeperator;
                  }
                  table = table.nextSibling
                }
              } else {
                "#text" == table.nodeName && $chk(table.nodeValue) && "" !== table.nodeValue && (rowSeperator = table.nodeValue, colSeperator = RegExp("\\t", "g"), rowSeperator = rowSeperator.replace(RegExp("\\n", "g"), ""), rowSeperator = rowSeperator.replace(colSeperator, ""), d += rowSeperator.trim());
              }
            } catch (e) {
              $rootScope.copiedTable = -1;
              $rootScope.waitingTable = -1;
              console.log("getting html error", e);
            }
            return d;
          }
        };

        console.log('getting html to copy');
        var res = TableUtil.nodeToString($('table#' + target)[0], copyConst.rowSeperator, copyConst.colSeperator);
        console.log('got html to copy', res);

        $rootScope.copiedTable = idx;
        $rootScope.waitingTable = -1;

        return (res);
      }

      $scope.setExportFile = function (filename) {
        return $scope.exportFile = 'views/exports/' + filename + '.html';
      }
      $scope.exportTable = function (filename) {

        $timeout(function () {
          $scope.setExportFile(filename);
        });

        $timeout(function () {
          var tableToExcel = (function () {
            var uri = 'data:application/vnd.ms-excel;base64,'
              , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
              , base64 = function (s) {
                return window.btoa(unescape(encodeURIComponent(s)))
              }
              , format = function (s, c) {
                return s.replace(/{(\w+)}/g, function (m, p) {
                  return c[p];
                })
              }
            return function (table, name, filename) {
              if (!table.nodeType) table = document.getElementById(table)
              var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML}

              document.getElementById("dlink").href = uri + base64(format(template, ctx));
              document.getElementById("dlink").download = filename;
              document.getElementById("dlink").click();

            }
          })()

          tableToExcel('exportTable', 'export', 'export_filename.xls');
        }, 1000);
      }

      $rootScope.init();

    }]);
