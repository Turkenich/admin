'use strict';

angular.module('adminApp')
  .controller('UsersCtrl', ['$scope', 'Users', 'Pets', function ($scope, Users, Pets) {
        function getItems(){
            $scope.items = Users.all();
        }
        getItems();
        $scope.pets = Pets.all();
        $scope.updateItem = function(item){
            console.log('updating', item);
            item.$update(function(item){
                Users.query({id: item._id}, function(item){
                    var i = $scope.items.findIndexById(item._id);
                    $scope.items[i] = item;
                });
            });
        }
        $scope.removeItem = function(item){
            if (confirm('Are You Sure???')){
                console.log('deleting', item);
                var i = $scope.items.findIndexById(item._id);
                Users.remove({id: item._id});
                $scope.items.splice(i,1);
            }
        }
        $scope.addItem = function(){
            Users.create(function(item){
                Users.query({id: item._id}, function(item){
                    $scope.items.push(item);
                });
            });
        }

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

        $scope.unadopt = function (item) {
            var pet = $scope.pets.findById(item.pet._id);
            pet.user = '';
            pet.$update(function (res) {
                $scope.pets = Pets.all();
            });
            item.pet = '';
            item.$update(function (res) {
                $scope.items = Users.all();
            });
        }

    }]);
