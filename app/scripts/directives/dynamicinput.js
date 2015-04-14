'use strict';

/**
 * @ngdoc directive
 * @name adminApp.directive:dynamicInput
 * @description
 * # dynamicInput
 */
angular.module('adminApp')
  .directive('dynamicInput', function () {
    return {
      restrict: 'E',
      scope: {
        type: '@',
        model: '=',
        item: '=',
        name: '@',
        options: '@',
      },
      template: function (element) {
        var tmpl = '<label for="{{id}}">{{name}}</label>';

        debugger;
        switch (element.attr('type')) {
          case 'textarea':
            tmpl += '<textarea id="{{id}}" ng-model="model" ng-change="updateOriginalItem()"/>';
            break;
          default:
            tmpl += '<input id="{{id}}" type="{{type}}" ng-model="model" />';
            break;
        }
        return tmpl;
      },
      link: function postLink(scope, element, attrs) {
        scope.id = attrs.type + '_' + attrs.name.replace(/'/g, "");

        scope.updateOriginalItem = function () {
          console.log(scope.item);
          console.log(scope.model);
          debugger;
        }
      }
    };
  });
