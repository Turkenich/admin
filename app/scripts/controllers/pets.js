'use strict';

angular.module('adminApp')
  .controller('PetsCtrl', ['$scope', '$routeParams', 'Pets', 'Users', function ($scope, $routeParams, Pets, Users) {

        $scope.users = Users.all();
        function getItems(){
            $scope.items = $routeParams.id ? [Pets.query({id: $routeParams.id})] : Pets.all();
        }
        getItems();
        $scope.updateItem = function(i){
            console.log('updating', $scope.items[i]);
            $scope.items[i].$update();
            getItems();
        }
        $scope.removeItem = function(item){
            if (confirm('Are You Sure???')){
                console.log('deleting', item);
                item.$remove();
                getItems();
            }
        }
        $scope.addItem = function(){
            Pets.create(function(res){
                getItems();
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
