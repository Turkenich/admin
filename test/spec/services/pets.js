'use strict';

describe('Service: pets', function () {

  // load the service's module
  beforeEach(module('adminApp'));

  // instantiate service
  var pets;
  beforeEach(inject(function (_pets_) {
    pets = _pets_;
  }));

  it('should do something', function () {
    expect(!!pets).toBe(true);
  });

});
