'use strict';

angular.module('adminApp')
  .controller('KennelsCtrl', ['$scope', 'Kennels', function ($scope, Kennels) {
        $scope.items = Kennels.all();
        $scope.updateItem = function(i){
            console.log('updating', $scope.items[i]);
            $scope.items[i].$update();
        }
        $scope.removeItem = function(i){
            if (confirm('Are You Sure???')){
                console.log('deleting', $scope.items[i]);
                $scope.items[i].$remove();
                $scope.items.splice(i, 1);
            }
        }
        $scope.addItem = function(){
            Kennels.create(function(res){
                $scope.items.push(res);
            });
        }

    }]);
