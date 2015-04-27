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
      },
      template: function () {
        var tmpl = '' +
          '<div class="media line">' +
          '<a ng-href="#/{{path}}/{{item._id}}" >' +
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
      }
    };
  }]);
