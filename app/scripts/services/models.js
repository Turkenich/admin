'use strict';

angular.module('adminApp')
  .factory('Models', ['$resource', function ($resource) {
    return $resource(Consts.api_root + 'models/:id', {}, {
      all: {method: 'GET', params: {}, isArray: true},
      query: {method: 'GET', params: {}, isArray: false},
      maxId: {method: 'GET', params: {id: 'maxId'}, isArray: false},
      create: {method: 'POST', params: {}},
      update: {method: 'PUT', params: {id: '@_id'}},
      remove: {method: 'DELETE', params: {id: '@_id'}}
    });
  }]);
