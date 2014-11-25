'use strict';

angular.module('adminApp')
  .controller('TreatsCtrl', ['$scope', 'Treats', function ($scope, Treats) {
        function getItems(){
            $scope.items = Treats.all();
        }
        getItems();
        $scope.updateItem = function(item){
            console.log('updating', item);
            item.$update(function(item){
                Treats.query({id: item._id}, function(item){
                    var i = $scope.items.findIndexById(item._id);
                    $scope.items[i] = item;
                });
            });
        }
        $scope.removeItem = function(item){
            if (confirm('Are You Sure???')){
                console.log('deleting', item);
                var i = $scope.items.findIndexById(item._id);
                Treats.remove({id: item._id});
                $scope.items.splice(i,1);
            }
        }
        $scope.addItem = function(){
            Treats.create(function(item){
                Treats.query({id: item._id}, function(item){
                    $scope.items.push(item);
                });
            });
        }

    }]);
