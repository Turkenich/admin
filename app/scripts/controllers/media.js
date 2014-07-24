'use strict';

angular.module('adminApp')
    .controller('MediaCtrl', ['$scope', '$http', '$timeout', '$routeParams', 'Instagram', 'Media', 'Pets', 'Kennels', 'Treats', 'Donations', function ($scope, $http, $timeout, $routeParams, Instagram, Media, Pets, Kennels, Treats, Donations) {

        function init() {
//            $scope.fetchMedia();
            $scope.hashtag = 'treatsforlife';
            $scope.activeFilter = '';
        }

        var formatMedia = function (item) {
            return {
                url: (item.videos ? item.videos.standard_resolution.url : item.images.standard_resolution.url),
                type: (item.videos ? 'vd' : 'im'),
                video: (item.videos ? item.videos.standard_resolution.url : ''),
                image: item.images.standard_resolution.url,
                created_time: item.created_time,
                caption: item.caption ? item.caption.text : '',
                link: item.link,
                ext_id: item.id,
                user_id: item.user.id,
                username: item.user.username
            }
        }

        $scope.fetchMedia = function (all, min_tag_id) {
            //fetch from instagram
            Media.last(function (lastItem) {
                console.log('lastItem', lastItem);
                Instagram.get($scope.hashtag, 1000, min_tag_id).success(function (res) {
                    $timeout(function () {
                        for (var i in res.data) {
                            if (!res.data[i] || !res.data[i].id) {
                                continue;
                            }
                            var item = formatMedia(res.data[i]);
                            if (all || lastItem.created_time >= item.created_time)
                                continue;
//                            $scope.instagram.push(item);
                            Media.create(item);
                        }

                        //fetch from our db
                        $timeout(function () {
                            $scope.items = Media.all();
                            if (res.pagination.min_tag_id){
                                $scope.fetchMedia(all, res.pagination.min_tag_id);
                            }
                        }, 500);

                    });
                });
            });

        }

        $timeout(function () {
            getItems();
            $scope.treats = Treats.all();
            $scope.pets = Pets.all();
            $scope.kennels = Kennels.all()
            $scope.donations = Donations.all();

            window.debug = $scope;
        })

        $scope.updateItem = function(item){
            console.log('updating', item);
            item.$update(function(item){
                Media.query({id: item._id}, function(item){
                    var i = $scope.items.findIndexById(item._id);
                    $scope.items[i] = item;
                });
            });
        }
        $scope.deleteItem = function(item){
            if (confirm('Are You Sure???')){
                console.log('deleting', item);
                var i = $scope.items.findIndexById(item._id);
                Media.remove({id: item._id});
                $scope.items.splice(i,1);
            }
        }
        $scope.addItem = function(){
            Media.create(function(item){
                Media.query({id: item._id}, function(item){
                    $scope.items.push(item);
                });
            });
        }

        function getItems(){
            $scope.items = $routeParams.id ? [Media.query({id: $routeParams.id})] : Media.all();
        }
        $scope.removeItem = function(item){
            item.removed = true;
            $scope.updateItem(item);
        }
        $scope.unremoveItem = function(item){
            item.removed = false;
            $scope.updateItem(item);
        }

        $scope.shouldFilterItem = function (item) {
            var filter = $scope.activeFilter;
            if (filter == 'new') {
                for (var field, i=0; field = ['removed','donation','pet'][i]; i++){
                    if(item[field] && item.activePill!=field){
                        return true;
                    }
                }
                return false;
//                return (item.removed || item.donation || item.pet);
            } else {
                return !item[filter];
            }
        }

        $scope.formatDonationName = function (donation) {
            return donation.treat.name + ' to ' + donation.pet.name + ' by ' + donation.user.name + ' at ' + donation.createdAt;
        }

        $scope.createPet = function (item) {
            var pet = item.pet;
            pet.image = item.image;
            pet.media = item._id;
            Pets.create(pet, function (res) {
                $scope.pets.push(res);
                item.pet = res;
                $scope.updateItem(item);
                item.activePill='';
            });
        }

        $scope.assignToDonation = function (item) {
            var donation = $scope.donations.findById(item.donation);
            donation.media = item;
            donation.$update(function (res) {
                item.donation = res._id;
                $scope.updateItem(item);
            });
        }

        init();

    }]);
