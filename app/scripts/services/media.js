'use strict';

angular.module('adminApp')
    .factory('Media', ['$resource', function ($resource) {
        return $resource(Consts.api_root + 'media/:id', {}, {
            all: { method: 'GET', params: {}, isArray: true },
            last: { method: 'GET', params: {id: 'last'}, isArray: false },
            query: { method: 'GET', params: {}, isArray: false },
            create: { method: 'POST' },
            update: { method: 'PUT', params: {id: '@_id'} },
            remove: { method: 'DELETE', params: {id: '@_id'} }
        });
    }]);
