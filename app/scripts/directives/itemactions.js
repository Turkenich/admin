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
      '<button class="btn btn-{{isDirty() ? \'primary\' : \'disabled\' }}" ng-click="saving=true; updateItem(item); goBack(1000);"><i class="fa fa-fw fa-{{saving ? \'refresh fa-spin\' : \'check\'}}"></i> שמירה וסיום</button>' +
      '<button class="btn btn-{{isDirty() ? \'primary\' : \'disabled\' }}" ng-click="updateItem(item);"><i class="fa fa-fw fa-save"></i> שמירה</button>' +
      '<button class="btn btn-{{isDirty() ? \'success\' : \'disabled\' }}" ng-click="duplicateItem(item)"><i class="fa fa-fw fa-plus"></i> שמירה כחדש</button>' +
      '<button class="btn btn-{{isDirty() ? \'default\' : \'disabled\' }}" ng-click="cancelChanges(); goBack(0);"><i class="fa fa-fw fa-undo"></i> ביטול</button>' +
      '<button class="btn btn-danger" ng-click="removeItem(item)"><i class="fa fa-fw fa-trash"></i> מחיקה</button>' +
      '</div>' +
      '<div style="clear:both;"></div>'
      ,
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        scope.isDirty = function () {
          return ($('.ng-dirty').length > 0);
        }

        scope.cancelChanges = function () {
          ($('.ng-dirty').removeClass('ng-dirty'));
        }

        scope.$on('$locationChangeStart', function (event) {
          if (scope.isDirty()) {
            var answer = confirm("עדיין לא שמרת את הפריט. מעבר העמוד יבטל את השינויים, האם ברצונך להמשיך?")
            if (!answer) {
              event.preventDefault();
            }
          }
        });
      }
    };
  });
