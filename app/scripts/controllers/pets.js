'use strict';

angular.module('adminApp')
  .controller('PetsCtrl', ['$scope', '$routeParams', 'Pets', function ($scope, $routeParams, Pets) {
        $scope.items = $routeParams.id ? [Pets.query({id: $routeParams.id})] : Pets.all();
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
            Pets.create(function(res){
                $scope.items.push(res);
            });
        }
        $scope.updateField= function(item, params){
            console.log('updating', item, params);
            var data = {};
            data['_id'] = item._id;
            data[params['key']] = params['val'];
            Pets.update(data);
        }
  }]);
