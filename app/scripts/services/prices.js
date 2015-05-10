'use strict';

angular.module('adminApp')
    .factory('Prices', ['$resource', function ($resource) {
        return $resource(Consts.api_root + 'prices/:id', {}, {
            all: { withCredentials: true, method: 'GET', params: {}, isArray: true },
            query: { withCredentials: true, method: 'GET', params: {}, isArray: false },
            create: { withCredentials: true, method: 'POST', params: {} },
            update: { withCredentials: true, method: 'PUT', params: {id: '@_id'} },
            remove: { withCredentials: true, method: 'DELETE', params: {id: '@_id'} }
        });
    }]);
