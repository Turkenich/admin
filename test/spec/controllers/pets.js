'use strict';

describe('Controller: PetsCtrl', function () {

  // load the controller's module
  beforeEach(module('adminApp'));

  var PetsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PetsCtrl = $controller('PetsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
