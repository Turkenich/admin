'use strict';

/**
 * @ngdoc directive
 * @name adminApp.directive:dynamicInput
 * @description
 * # dynamicInput
 */
angular.module('adminApp')
  .directive('listItem', ['$rootScope', '$location', function ($rootScope, $location) {
    return {
      restrict: 'E',
      scope: {
        index: '=',
        item: '=',
        path: '@',
        addto: '=',
      },
      templateUrl: 'views/partials/listItem.html',
      link: function postLink(scope, element, attrs) {
        scope.removeItem = scope.$parent.removeItem;
        scope.moveItemUp = scope.$parent.moveItemUp;
        scope.moveItemDown = scope.$parent.moveItemDown;

        //scope.item.smallImage = function(){
        if (scope.item.image) {
          var splitted = scope.item.image.split('/');
          splitted[splitted.length-2] = 'c_fill,g_center,h_64,w_64'
          scope.item.small_image = splitted.join('/');
        }else if (angular.isDefined(scope.item.image)) {
          scope.item.small_image = 'images/noimage64.jpg';

        }

        switch (scope.path) {
          case
          'elements'
          :
            scope.parentPath = 'models';
            break;
          case
          'models'
          :
            scope.parentPath = 'orders';
            break;
          default :
            scope.parentPath = false;
        }

        if (scope.addto) {
          scope.link = '#/' + scope.parentPath + '/' + scope.addto + '?addId=' + scope.item._id;
        } else {
          scope.link = '#/' + scope.path + '/' + scope.item._id;
        }
      }
    }
      ;
  }])
;
