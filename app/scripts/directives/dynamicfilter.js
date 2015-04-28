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
        range: '@'
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
          case 'date':
            tmpl += '<p class="input-group">' +
            '<input type="text" class="form-control ltr-datepicker" datepicker-popup="shortDate" ng-model="filter" is-open="opened" close-text="Close"  ng-change="updateFilter()" />' +
            '<span class="input-group-btn">' +
            '<button type="button" class="btn btn-default" ng-click="open($event)"><i class="glyphicon glyphicon-calendar"></i></button>' +
            '</span>' +
            '</p>';

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

        scope.updateFilter = function () {
          var suffix='';
          if (angular.isUndefined(scope.range)) {
            suffix='';
          }else{
            suffix = '_' + scope.range;
          }
          $rootScope.filter[scope.id + suffix] = scope.filter;
          console.log('filter updated', $rootScope.filter);
        }

        scope.open = function($event) {
          $event.preventDefault();
          $event.stopPropagation();
          scope.opened = true;
        };

        scope.dateOptions = {
          formatYear: 'yy',
          startingDay: 1
        };


      }
    };
  }]);