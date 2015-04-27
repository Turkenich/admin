'use strict';

/**
 * @ngdoc filter
 * @name adminApp.filter:listFilter
 * @function
 * @description
 * # listFilter
 * Filter in the adminApp.
 */
angular.module('adminApp')
  .filter('listFilter', ['$rootScope', function ($rootScope) {
    return function (input) {
      if (input.length <= 0) return;

      var filter = $rootScope.filter;
      var list = [];
      var limit = 10;

      for (var item, i=0; item=input[i]; i++){
        if (list.length > limit) break;
        if (shouldKeepItem(item, filter)) {
          list.push(item);
        }
      }

      function shouldKeepItem(item, filter){
        for (var f in filter){
          if (!item[f]) return false;
          if (!filter[f]) return true;
          if ((item[f] == filter[f])) return true;
          if ((typeof(item[f]) == 'string') && (typeof(filter[f]) == 'string')){
            var patt = new RegExp(filter[f]);
            return patt.test(item[f]);
          }
        }
        return true;
      }

      return list;
    };
  }]);
