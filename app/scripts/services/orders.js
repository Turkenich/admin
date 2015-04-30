'use strict';

angular.module('adminApp')
    .factory('Orders', ['$resource', function ($resource) {
        return $resource(Consts.api_root + 'orders/:id', {}, {
            all: { method: 'GET', params: {}, isArray: true },
            query: { method: 'GET', params: {}, isArray: false },
            create: { method: 'POST', params: {} },
            update: { method: 'PUT', params: {id: '@_id'} },
            remove: { method: 'DELETE', params: {id: '@_id'} }
        });
    }]);
