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
        item: '=',
        path: '@',
        addto: '=',
      },
      template: function (element) {

        var tmpl = '' +
          '<div class="media line">' +
          '<a ng-href="{{link}}" >' +
          '<div class="media-body">{{item.name}} {{item.desc}} <i class="fa fa-external-link"></i> </div>' +
          '</a>' +
          '<i class="fa fa-trash" ng-click="removeItem(item)"></i>' +
          '<hr/>' +
          '</div>' +
          '';

        return tmpl;
      },
      link: function postLink(scope, element, attrs) {
        scope.removeItem = scope.$parent.removeItem;

        switch (scope.path){
          case 'elements':
            scope.parentPath = 'models';
            break;
          case 'models':
            scope.parentPath = 'orders';
            break;
          default :
            scope.parentPath = false;
        }

        if (scope.addto){
          scope.link = '#/' + scope.parentPath + '/' + scope.addto + '?addId=' + scope.item._id;
        }else{
          scope.link = '#/' + scope.path + '/' + scope.item._id;
        }
      }
    };
  }]);
