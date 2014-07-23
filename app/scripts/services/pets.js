'use strict';

angular.module('adminApp')
    .factory('Pets', ['$resource', function ($resource) {
        return $resource(Consts.api_root + 'pet/:id', {}, {
            all: { method: 'GET', params: {}, isArray: true },
            query: { method: 'GET', params: {}, isArray: false },
            create: { method: 'POST', params: {force: '1'}},
            update: { method: 'PUT', params: {id: '@_id'} },
            remove: { method: 'DELETE', params: {id: '@_id'} }
        });
    }]);
