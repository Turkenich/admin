'use strict';

/**
 * @ngdoc directive
 * @name adminApp.directive:dynamicInput
 * @description
 * # dynamicInput
 */
angular.module('adminApp')
  .directive('dynamicInput', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
    return {
      restrict: 'E',
      scope: {
        type: '@',
        model: '=',
        item: '=',
        name: '@',
        desc: '@',
        options: '=',
      },
      template: function (element) {
        var tmpl = '' +
          '<div class="form-group tile">' +
          '<label for="{{id}}" class="control-label" title="{{desc}}">{{name}}</label>';

        switch (element.attr('type')) {
          case 'select':
            tmpl += '<select class="form-control" id="{{id}}" ng-model="model" placeholder="{{desc}}" ng-options="option.name  for option in options track by option._id " ></select>';
            break;
          case 'textarea':
            tmpl += '<textarea class="form-control" id="{{id}}" ng-model="model" placeholder="{{desc}}"/>';
            break;
          default:
            tmpl += '<input class="form-control" id="{{id}}" type="{{type}}" ng-model="model" placeholder="{{desc}}"/>';
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
            if (0 && newVal) { //removed because it caused trouble in casting to objectId
              if (!scope.options.findById(null, '_id')) {
                scope.options.unshift({name: scope.placeholder, _id: null});
              }
              if (element.attr('type') == 'select') {
                  if (null == scope.model && angular.isDefined(scope.options) && scope.options[0] && scope.options[0]._id==null) {
                    scope.model = scope.options[0];
                  }
              }
            }
          });
        })
      }
    };
  }]);