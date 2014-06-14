'use strict';

angular.module('adminApp')
    .factory('Kennels', ['$resource', function ($resource) {
        return $resource(Consts.api_root + 'kennel/:id', {}, {
            all: { method: 'GET', params: {}, isArray: true },
            query: { method: 'GET', params: {}, isArray: false },
            create: { method: 'POST' },
            update: { method: 'PUT', params: {id: '@_id'} },
            remove: { method: 'DELETE', params: {id: '@_id'} }
        });
    }]);
