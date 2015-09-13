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
          '<div class="form-group tile {{range}}">' +
          '<label for="{{id}}" class="control-label {{range}}" title="{{desc}}">{{name}}</label>' +
          '<i class="fa fa-info-circle tile-info {{range}}" data-container="body" data-toggle="popover"  data-trigger="focus" data-placement="top" data-content="{{desc}}"></i>';

        switch (element.attr('type')) {
          case 'select':
            tmpl += '<select class="form-control" id="{{id}}" ng-model="filter" placeholder="{{desc}}" ng-change="updateFilter()" ng-options="option.name  for option in options track by option._id " >' +
            '<option value="" selected>--------</option>' +
            '</select>';
            break;
          case 'parent':
            //tmpl += '<select class="form-control" id="{{id}}" ng-model="filter" placeholder="{{desc}}" ng-change="updateFilter()" ng-options="option.name  for option in options track by option._id " >' +
            //'<option value="" selected>--------</option>' +
            //'</select>';
            tmpl += '<input class="form-control" id="{{id}}" type="text" ng-model="filter" placeholder="{{desc}}" typeahead-on-select="updateFilter()" typeahead="option as option.name for option in options | filter:{name:$viewValue}" typeahead-loading="loadingLocations" typeahead-no-results="noResults" />' +
            '<i ng-show="loadingLocations" class="glyphicon glyphicon-refresh"></i>' +
            '<div ng-show="noResults">' +
            '<i class="glyphicon glyphicon-remove"></i> אין תוצאות' +
            '</div>';
            break;
          case 'textarea':
            tmpl += '<textarea class="form-control" id="{{id}}" ng-model="filter" placeholder="{{desc}}" ng-change="updateFilter()"/>';
            break;
          case 'date':
            tmpl += '<p class="input-group {{range}}">' +
            '<input type="text" class="form-control ltr-datepicker {{range}}" datepicker-popup="dd/MM/yy" ng-model="filter" is-open="opened" close-text="Close"  ng-change="updateFilter()" />' +
            '<span class="input-group-btn">' +
            '<button type="button" class="btn btn-default {{range}}" ng-click="open($event)"><i class="glyphicon glyphicon-calendar"></i></button>' +
            '</span>' +
            '</p>';

            break;

          default:
            tmpl += '<input class="form-control {{range}}" id="{{id}}" type="{{type}}" placeholder="{{desc}}" ng-model="filter" ng-change="updateFilter()"/>';
            break;
        }

        //tmpl += '<p class="help-block"></p>' +
        '</div>';

        return tmpl;
      },
      link: function postLink(scope, element, attrs) {
        scope.id = attrs.model.replace(/'/g, "");

        scope.updateFilter = function () {
          if (scope.type == 'parent'){
            debugger;
            if (!scope.filter) {
              $rootScope.filter['_id']=null;
              return;
            }
            $rootScope.filter['_id'] = JSON.parse(scope.filter._id);
          }else{
            var suffix='';
            if (angular.isUndefined(scope.range)) {
              suffix='';
            }else{
              suffix = '_' + scope.range;
            }
            if (scope.filter){
              $rootScope.filter[scope.id + suffix] = scope.filter;
            }else{
              delete $rootScope.filter[scope.id + suffix];
            }
          }
          console.log('filter updated', $rootScope.filter);
        }

        scope.open = function($event) {
          $event.preventDefault();
          $event.stopPropagation();
          scope.opened = true;
        };

        scope.$watch('options', function (newVal, oldVal) {
          if (newVal) {
            if (element.attr('type') == 'select') {
              if (angular.isDefined(scope.options) && scope.options[0] && !scope.model) {
                scope.model = scope.options[0];
              }
            }
          }
        });


      }
    };
  }]);
