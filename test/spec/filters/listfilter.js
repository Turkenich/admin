'use strict';

describe('Filter: listFilter', function () {

  // load the filter's module
  beforeEach(module('adminApp'));

  // initialize a new instance of the filter before each test
  var listFilter;
  beforeEach(inject(function ($filter) {
    listFilter = $filter('listFilter');
  }));

  it('should return the input prefixed with "listFilter filter:"', function () {
    var text = 'angularjs';
    expect(listFilter(text)).toBe('listFilter filter: ' + text);
  });

});
