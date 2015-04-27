'use strict';

describe('Directive: itemActions', function () {

  // load the directive's module
  beforeEach(module('adminApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<item-actions></item-actions>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the itemActions directive');
  }));
});
