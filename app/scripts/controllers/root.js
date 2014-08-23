'use strict';

angular.module('adminApp')
    .controller('RootCtrl', ['$scope', '$sce', function ($scope, $sce) {

        console.log('VERSION: ' + '1.0');

        $scope.trustUrl = function(url){
            return $sce.trustAsResourceUrl(url);
        }

    }]);