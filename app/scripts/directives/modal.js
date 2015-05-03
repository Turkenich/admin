'use strict';

/**
 * @ngdoc directive
 * @name adminApp.directive:modal
 * @description
 * # modal
 */
angular.module('adminApp').controller('ModalInstanceCtrl', function ($scope, $modalInstance, ok, cancel) {

  $scope.ok = function () {
    $modalInstance.close('ok');
    ok();
  };

  $scope.cancel = function () {
    $modalInstance.close('cancel');
    cancel();
  };
});


/*
angular.module('adminApp')
  .directive('modal', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the modal directive');
      }
    };
  });
*/
