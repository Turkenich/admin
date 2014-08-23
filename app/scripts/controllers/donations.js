'use strict';

angular.module('adminApp')
  .controller('DonationsCtrl', ['$scope', 'Donations', 'Pets', 'Users', 'Treats', 'Media', function ($scope, Donations, Pets, Users, Treats, Media) {
        $scope.items =  Donations.all();
        $scope.updateItem = function(item){
            console.log('updating', item);
            item.$update(function(item){
                Donations.query({id: item._id}, function(item){
                    var i = $scope.items.findIndexById(item._id);
                    $scope.items[i] = item;
                });
            });
        }
        $scope.removeItem = function(item){
            if (confirm('Are You Sure???')){
                console.log('deleting', item);
                var i = $scope.items.findIndexById(item._id);
                Donations.remove({id: item._id});
                $scope.items.splice(i,1);
            }
        }
        $scope.addItem = function(){
            Donations.create(function(item){
                Donations.query({id: item._id}, function(item){
                    $scope.items.push(item);
                });
            });
        }

        $scope.giveItem = function(item){
            item.given = true;
            $scope.updateItem(item);
        }

        $scope.treats = Treats.all();
        $scope.users = Users.all();
        $scope.medias = Media.all();
        $scope.pets = Pets.all();

        window.debug = $scope;
    }]);
