'use strict';

angular.module('adminApp')
  .controller('UsersCtrl', ['$scope', 'Users', 'Pets', function ($scope, Users, Pets) {
        $scope.items = Users.all();
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
            Users.create(function(res){
                $scope.items.push(res);
            });
        }

        $scope.pets = Pets.all();
        $scope.assignPet = function (item) {
            var pet = $scope.pets.findById(item.pet);
            pet.user = item._id;
            pet.$update(function (res) {
                $scope.pets = Pets.all();
            });
            item.pet = pet._id;
            item.$update(function (res) {
                $scope.items = Users.all();
            });
        }

    }]);
