'use strict';

angular.module('adminApp')
  .controller('PetsCtrl', ['$scope', '$routeParams', 'Pets', 'Users', function ($scope, $routeParams, Pets, Users) {
        $scope.items = $routeParams.id ? [Pets.query({id: $routeParams.id})] : Pets.all();
        $scope.users = Users.all();
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
        $scope.assignOwner = function (item) {
            var user = $scope.users.findById(item.user);
            user.pet = item._id;
            user.$update(function (res) {
                debugger;
            });
            item.user = user._id;
            item.$update(function (res) {
                debugger;
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
