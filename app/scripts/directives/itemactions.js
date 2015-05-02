'use strict';

/**
 * @ngdoc directive
 * @name adminApp.directive:itemActions
 * @description
 * # itemActions
 */
angular.module('adminApp')
  .directive('itemActions', function () {
    return {
      template: '  <div class="btn-group" role="group" aria-label="...">' +
      '<button class="btn btn-{{isDirty() ? \'primary\' : \'disabled\' }}" ng-click="updateItem(item); goBack();"><i class="fa fa-check"></i> שמירה</button>' +
      '<button class="btn btn-{{isDirty() ? \'success\' : \'disabled\' }}" ng-click="duplicateItem(item)"><i class="fa fa-plus"></i> שמירה כחדש</button>' +
      '<button class="btn btn-{{isDirty() ? \'default\' : \'disabled\' }}" ng-click="reloadItem(item)"><i class="fa fa-undo"></i> ביטול</button>' +
      '<button class="btn btn-danger" ng-click="removeItem(item)"><i class="fa fa-trash"></i> מחיקה</button>' +
      '</div>' +
      '<div style="clear:both;"></div>'
      ,
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        scope.isDirty = function() { return ($('.ng-dirty').length > 0); }
      }
    };
  });
