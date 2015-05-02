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
            tmpl += '<select class="form-control" id="{{id}}" ng-model="model" placeholder="{{desc}}" ng-options="option.name  for option in options track by option._id " >' +
            '<option value="" selected>--------</option>' +
            '</select>';
            break;
          case 'textarea':
            tmpl += '<textarea class="form-control" id="{{id}}" ng-model="model" placeholder="{{desc}}"/>';
            break;
          case 'image':
            tmpl += '<input class="form-control" id="{{id}}" type="text" ng-model="model" placeholder="{{desc}}" style="height:0px; padding:0px; visibility: hidden;"/>' +
            '<a  ng-click="displayUploader(true);" class="thumbnail" style="margin: -15px 0 0 0;"><img ng-src="{{model || \'/images/default_image.png\'}}" alt="..."></a>' +
            '<image-uploader ng-if="showUploader" type="photo" enabled="true" width="640"height="480" model="model"></image-uploader>'
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

        scope.showUploader = $rootScope.showUploader;
        scope.displayUploader = function (status) {
          $rootScope.showUploader = status;
          scope.showUploader = $rootScope.showUploader;
        }

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
        });
      }
    }
  }]);
