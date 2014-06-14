'use strict';

angular.module('adminApp')
  .controller('DonationsCtrl', ['$scope', 'Donations', 'Pets', 'Users', 'Treats', 'Media', function ($scope, Donations, Pets, Users, Treats, Media) {
        $scope.items = Donations.all();
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
            Donations.create(function(res){
                $scope.items.push(res);
            });
        }

        $scope.treats = Treats.all();
        $scope.users = Users.all();
        $scope.medias = Media.all();
        $scope.pets = Pets.all();

        window.debug = $scope;
    }]);
