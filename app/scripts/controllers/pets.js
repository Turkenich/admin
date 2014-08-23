'use strict';

angular.module('adminApp')
  .controller('PetsCtrl', ['$scope', '$routeParams', 'Pets', 'Users', function ($scope, $routeParams, Pets, Users) {

        $scope.users = Users.all();
        function getItems(){
            $scope.items = $routeParams.id ? [Pets.query({id: $routeParams.id})] : Pets.all();
        }
        getItems();
        $scope.updateItem = function(item){
            console.log('updating', item);
            item.$update(function(item){
                Pets.query({id: item._id}, function(item){
                    var i = $scope.items.findIndexById(item._id);
                    $scope.items[i] = item;
                });
            });
        }
        $scope.removeItem = function(item){
            if (confirm('Are You Sure???')){
                $scope.unadopt();
                console.log('deleting', item);
                var i = $scope.items.findIndexById(item._id);
                Pets.remove({id: item._id});
                $scope.items.splice(i,1);
            }
        }
        $scope.addItem = function(){
            Pets.create(function(item){
                Pets.query({id: item._id}, function(item){
                    $scope.items.push(item);
                });
            });
        }

        $scope.updateField= function(item, params){
            console.log('updating', item, params);
            var data = {};
            data['_id'] = item._id;
            data[params['key']] = params['val'];
            Pets.update(data);
        }
        $scope.assignOwner = function (item) {
            var user = $scope.users.findById(item.user);
            user.pet = item._id;
            user.$update(function (res) {
                $scope.users = Users.all();
            });
            item.user = user._id;
            item.$update(function (res) {
                $scope.items = $routeParams.id ? [Pets.query({id: $routeParams.id})] : Pets.all();
            });
        }

        $scope.unadopt = function (item) {
            var user = $scope.users.findById(item.user._id);
            user.pet = '';
            user.$update(function (res) {
                $scope.users = Users.all();
            });
            item.user = '';
            item.$update(function (res) {
                $scope.items = $routeParams.id ? [Pets.query({id: $routeParams.id})] : Pets.all();
            });
        }

        $scope.shouldFilterItem = function (item) {
            var filter = $scope.activeFilter;
            if (filter == 'all') {
                return false;
            }else if (filter == 'lonely') {
                return (item['user'])
            }else if (filter == 'adopted') {
                return (!item['user'])
            } else {
                return true;
            }
        }

    }]);
