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

      function shouldKeepItem(item, filters){
        for (var field in filters){

          var filter = filters[field];

          var f_parts = field.split('_');
          var f = f_parts[0];
          if (f_parts[1]) {var f_type = f_parts[1];}

          if (!item[f]) return false;
          //if ((item[f] == filter)) return true;
          if (angular.isDate(filter)){
            var filterDate = new Date(filter);
            var itemDate = new Date(item[f]);
            if (f_type=='below'){
              if (filterDate <= itemDate) return false;
            }else if (f_type=='above'){
              if (filterDate >= itemDate) return false;
            }
          }
          if ((typeof(item[f]) == 'string') && (typeof(filter) == 'string')){
            var patt = new RegExp(filter);
            if (!patt.test(item[f])) return false;
          }
        }
        return true;
      }

      return list;
    };
  }]);
