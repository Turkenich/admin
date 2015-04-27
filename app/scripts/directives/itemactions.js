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
      '<button class="btn btn-primary" ng-click="updateItem(item)"><i class="fa fa-check"></i> שמירה</button>' +
      '<button class="btn btn-success" ng-click="duplicateItem(item)"><i class="fa fa-plus"></i> שמירה כחדש</button>' +
      '<button class="btn btn-default" ng-click="reloadItem(item)"><i class="fa fa-undo"></i> ביטול</button>' +
      '<button class="btn btn-default" ng-click="removeItem(item)"><i class="fa fa-trash"></i> מחיקה</button>' +
      '</div>'
      ,
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
      }
    };
  });
