'use strict';

angular.module('adminApp')
    .controller('RootCtrl', ['$scope', '$sce', function ($scope, $sce) {
        $scope.trustUrl = function(url){
            return $sce.trustAsResourceUrl(url);
        }

    }]);