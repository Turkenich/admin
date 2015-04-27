'use strict';

/**
 * @ngdoc directive
 * @name adminApp.directive:dynamicInput
 * @description
 * # dynamicInput
 */
angular.module('adminApp')
  .directive('dynamicFilter', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
    return {
      restrict: 'E',
      scope: {
        type: '@',
        model: '@',
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
            tmpl += '<select class="form-control" id="{{id}}" ng-model="filter" placeholder="{{desc}}" ng-change="updateFilter()" ng-options="option.name  for option in options track by option._id " ></select>';
            break;
          case 'textarea':
            tmpl += '<textarea class="form-control" id="{{id}}" ng-model="filter" placeholder="{{desc}}" ng-change="updateFilter()"/>';
            break;
          default:
            tmpl += '<input class="form-control" id="{{id}}" type="{{type}}" placeholder="{{desc}}" ng-model="filter" ng-change="updateFilter()"/>';
            break;
        }

        //tmpl += '<p class="help-block"></p>' +
        '</div>';

        return tmpl;
      },
      link: function postLink(scope, element, attrs) {
        scope.id = attrs.model.replace(/'/g, "");

        scope.updateFilter = function() {
          $rootScope.filter[scope.id] = scope.filter;
          console.log('filter updated', $rootScope.filter);
        }
      }
    };
  }]);
