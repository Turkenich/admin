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
        desc: '@',
        placeholder: '@',
        options: '=',
      },
      template: function (element) {
        var tmpl = '' +
          '<div class="form-group tile">' +
          '<label for="{{id}}" class="control-label" title="{{desc}}">{{name}}</label>';

        switch (element.attr('type')) {
          case 'select':
            tmpl += '<select class="form-control" id="{{id}}" ng-model="model" ng-options="option.name for option in options" ></select>';
            break;
          case 'textarea':
            tmpl += '<textarea class="form-control" id="{{id}}" ng-model="model" placeholder="{{placeholder}}"/>';
            break;
          default:
            tmpl += '<input class="form-control" id="{{id}}" type="{{type}}" ng-model="model" placeholder="{{placeholder}}"/>';
            break;
        }

        //tmpl += '<p class="help-block"></p>' +
        '</div>';

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

          scope.$watch('options', function (newVal, oldVal) {
            if (newVal) {
              scope.options.unshift({name: '------  ' + scope.placeholder + '  ------' });
            }
          });
        })
      }
    };
  }]);
