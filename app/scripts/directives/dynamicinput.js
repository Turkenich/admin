'use strict';

/**
 * @ngdoc directive
 * @name adminApp.directive:dynamicInput
 * @description
 * # dynamicInput
 */
angular.module('adminApp')
  .directive('dynamicInput', ['$timeout', function ($timeout) {
    return {
      restrict: 'E',
      scope: {
        type: '@',
        model: '=',
        item: '=',
        name: '@',
        options: '=',
      },
      template: function (element) {
        var tmpl = '<label for="{{id}}">{{name}}</label>';

        switch (element.attr('type')) {
          case 'select':
            tmpl += '<select id="{{id}}" ng-model="model" ng-options="option.name for option in options"></select>';
            break;
          case 'textarea':
            tmpl += '<textarea id="{{id}}" ng-model="model"/>';
            break;
          default:
            tmpl += '<input id="{{id}}" type="{{type}}" ng-model="model" />';
            break;
        }
        return tmpl;
      },
      link: function postLink(scope, element, attrs) {
        scope.id = attrs.type + '_' + attrs.name.replace(/'/g, "");

        //pre select existing value in select boxes
        scope.$watch('model', function (newVal, oldVal) {
          if (newVal) {
            if (element.attr('type') == 'select') {
              $timeout(function () {
                if (angular.isObject(scope.model)) {
                  scope.model = scope.options.findById(scope.model._id);
                } else {
                  scope.model = scope.options.findById(scope.model);
                }
              });
            }
          }
        })
      }
    };
  }]);
