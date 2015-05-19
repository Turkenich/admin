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
        placeholder: '=',
        item: '=',
        name: '@',
        desc: '@',
        options: '=',
      },
      template: function (element) {
        var tmpl = '' +
          '<div class="form-group tile">' +
          '<label for="{{id}}" class="control-label" title="{{placeholder}}">{{name}}</label>' +
          '<i class="fa fa-info-circle tile-info" data-container="body" data-toggle="popover" data-placement="top" data-content="{{desc}}"></i>';

        switch (element.attr('type')) {
          case 'date':
            if (element.attr('locked')){
              tmpl += '<span class="form-control" id="{{id}}" type="text">{{model | date:\'dd/MM/yyyy\'}}</span>';
            }else{
              tmpl += '<textarea class="form-control" id="{{id}}" type="text">{{model | date:\'dd/MM/yyyy\'}}</textarea>';
            }
            break;
          case 'select':
            tmpl += '<select class="form-control" id="{{id}}" ng-model="model" placeholder="{{placeholder}}" ng-change="measureUnitsChanged()" ng-options="option.name  for option in options track by option._id " >' +
            '<option value="" selected>--------</option>' +
            '</select>';
            break;
          case 'textarea':
            tmpl += '<textarea class="form-control" id="{{id}}" ng-model="model" placeholder="{{placeholder}}"/>';
            break;
          case 'image':
            tmpl += '<input class="form-control" id="{{id}}" type="text" ng-model="model" placeholder="{{placeholder}}" style="height:0px; padding:0px; visibility: hidden;"/>' +
            '<a  ng-click="displayUploader(true);" id="imageUploader" class="thumbnail" style="malrgin: -15px 0 0 0;"><img ng-src="{{model || \'/images/default_image.png\'}}" alt="..."></a>' +
            '<image-uploader ng-if="showUploader" type="photo" enabled="true" width="640"height="480" model="model"></image-uploader>'
            break;
          default:
            if (element.attr('locked')){
              tmpl += '<span class="form-control" id="{{id}}" type="text">{{model}}</span>';
            }else{
              tmpl += '<input class="form-control" id="{{id}}" type="{{type}}" ng-model="model" placeholder="{{placeholder}}"/>';
            }
            break;
        }

        //tmpl += '<p class="help-block"></p>' +
        '</div>';

        return tmpl;
      },
      link: function postLink(scope, element, attrs) {
        scope.id = attrs.type + '_' + attrs.name.replace(/'/g, "");
        scope.placeholder = scope.placeholder ? scope.placeholder : scope.desc;

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

        $(function () {
          $('[data-toggle="popover"]').popover()
        })

        scope.measureUnitsChanged = function(){
          scope.$emit('measureUnitsChanged');
        }
      }
    }
  }]);
