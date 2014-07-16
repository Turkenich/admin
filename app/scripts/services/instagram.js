'use strict';

//angular.module('clientApp')
//.factory('Instagram', ['$http',
//    function() {
//        return Instajam.init({
//            clientId: '1e7c407bd22b435e8447b7607245a947',
//            redirectUri: 'http://127.0.0.1:9000',
//            scope: ['basic', 'comments']
//        });
//    }
//]);

angular.module('adminApp')
    .factory('Instagram', ['$http',
        function ($http) {
            var base = "https://api.instagram.com/v1";
            var clientId = 'd9c1142d0ac14d1ea5a45bc8478006a4';
            return {
                'get': function (hashtag, count, min_tag_id) {

                    var params = {
                        'params': {
                            'client_id': clientId,
                            'count': count,
                            'callback': 'JSON_CALLBACK'
                        }
                    }
                    if (min_tag_id)
                        params.params['min_tag_id'] = min_tag_id;

                    var items = $http.jsonp('https://api.instagram.com/v1/tags/' + hashtag + '/media/recent', params, function () {
                    });

                    console.log(items);
                    return items;
                }
            };
        }
    ]);
