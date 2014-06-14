'use strict';

describe('Service: kennels', function () {

  // load the service's module
  beforeEach(module('adminApp'));

  // instantiate service
  var kennels;
  beforeEach(inject(function (_kennels_) {
    kennels = _kennels_;
  }));

  it('should do something', function () {
    expect(!!kennels).toBe(true);
  });

});
