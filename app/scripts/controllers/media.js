'use strict';

angular.module('adminApp')
    .controller('MediaCtrl', ['$scope', '$http', '$timeout', 'Instagram', 'Media', 'Pets', 'Kennels', 'Treats', 'Donations', function ($scope, $http, $timeout, Instagram, Media, Pets, Kennels, Treats, Donations) {

        function init() {
//            $scope.fetchMedia();
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

        $scope.fetchMedia = function () {
            //fetch from instagram
            Media.last(function (lastItem) {
                console.log('lastItem', lastItem);
                Instagram.get(100).success(function (res) {
                    $timeout(function () {
                        debugger;
                        $scope.instagram = [];
                        for (var i in res.data) {
                            var item = formatMedia(res.data[i]);
                            if (lastItem.created_time >= item.created_time)
                                break;
                            $scope.instagram.push(item);
                            Media.create(item);
                        }

                        //fetch from our db
                        $scope.items = Media.all();

                    });
                });
            });

        }

        $timeout(function () {
            $scope.items = Media.all();
            $scope.treats = Treats.all();
            $scope.pets = Pets.all();
            $scope.kennels = Kennels.all()
            $scope.donations = Donations.all();

            window.debug = $scope;
        })

        $scope.updateItem = function (i) {
            console.log('updating', $scope.items[i]);
            $scope.items[i].$update();
        }
        $scope.removeItem = function (i) {
            if (confirm('Are You Sure???')) {
                console.log('deleting', $scope.items[i]);
                $scope.items[i].removed = true;
                $scope.items[i].$update();
            }
        }

        $scope.formatDonationName = function (donation) {
            return donation.treat.name + ' to ' + donation.pet.name + ' by ' + donation.user.name + ' at ' + donation.createdAt;
        }

        $scope.createPet = function (i) {
            var item = $scope.items[i];
            var pet = item.pet;
            pet.image = item.image;
            pet.media = item._id;
            Pets.create(pet, function (res) {
                $scope.pets.push(res);
                item.pet = res;
                item.$update();
            });
        }

        $scope.assignToDonation = function (i) {
            var item = $scope.items[i];
            var donation = $scope.donations.findById(item.donation);
            donation.media = item;
            donation.$update(function (res) {
                item.donation = res._id;
                item.$update();
            });
        }

        init();

    }]);
