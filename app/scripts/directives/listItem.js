'use strict';

/**
 * @ngdoc directive
 * @name adminApp.directive:dynamicInput
 * @description
 * # dynamicInput
 */
angular.module('adminApp')
  .directive('listItem', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
    return {
      restrict: 'E',
      scope: {
        item: '=',
        path: '@',
        addto: '=',
      },
      template: function (element) {

        var link = '';
        if (element.attr('addTo')) {
          link = '<a ng-href="#/{{parentPath}}/{{addto}}?addId={{item._id}}" >'
        } else {
          link = '<a ng-href="#/{{path}}/{{item._id}}" >';
        }


        var tmpl = '' +
          '<div class="media line">' +
          link +
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
      }
    };
  }]);
