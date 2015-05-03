'use strict';

/**
 * @ngdoc directive
 * @name adminApp.directive:imageUploader
 * @description
 * # imageUploader
 */
angular.module('adminApp')
  .directive('imageUploader', ['$rootScope', '$upload', '$timeout', '$sce', function ($rootScope, $upload, $timeout, $sce) {
    return {
      templateUrl: 'views/partials/camera.html',
      replace: false,
      transclude: true,
      restrict: 'E',
      scope: {
        type: '@',
        width: '@',
        model: '@',
        height: '@',
        overlaySrc: '=',
        countdown: '@',
        enabled: '=',
        captureMessage: '@'
      },
      link: function (scope, element, attrs, ngModel) {
        scope.activeCountdown = false;
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
        scope.$on('$destroy', function () {
          if (scope.stream && typeof scope.stream.stop === 'function') {
            scope.stream.stop();
          }
        });
        scope.enableCamera = function () {
          return navigator.getUserMedia({
            audio: false,
            video: true
          }, function (stream) {
            return scope.$apply(function () {
              scope.stream = stream;
              scope.isLoaded = true;
              return scope.videoStream = $sce.trustAsResourceUrl(window.URL.createObjectURL(stream));
            });
          }, function (error) {
            return scope.$apply(function () {
              scope.isLoaded = true;
              return scope.noCamera = true;
            });
          });
        };
        scope.disableCamera = function () {
          return navigator.getUserMedia({
            audio: false,
            video: true
          }, function (stream) {
            return scope.$apply(function () {
              return scope.videoStream = '';
            });
          });
        };
        scope.takePicture = function () {
          var canvas, context, countdownTick, countdownTime;
          canvas = window.document.getElementById('ng-photo-canvas');
          countdownTime = scope.countdown != null ? parseInt(scope.countdown) * 1000 : 0;
          if (canvas != null) {
            if (countdownTime > 0) {
              scope.activeCountdown = true;
              scope.hideUI = true;
            }
            context = canvas.getContext('2d');
            if (scope.countdownTimer) {
              $timeout.cancel(scope.countdownTimer);
            }
            scope.countdownTimer = $timeout(function () {
              var cameraFeed;
              scope.activeCountdown = false;
              cameraFeed = window.document.getElementById('ng-camera-feed');
              context.drawImage(cameraFeed, 0, 0, scope.width, scope.height);
              if (scope.overlaySrc != null) {
                scope.addFrame(context, scope.overlaySrc, function (image) {
                  scope.$apply(function () {
                    return scope.media = canvas.toDataURL('image/jpeg');
                  });
                  if (scope.captureCallback != null) {
                    return scope.captureCallback(scope.media);
                  }
                });
              } else {
                scope.media = canvas.toDataURL('image/jpeg');
                if (scope.captureCallback != null) {
                  scope.captureCallback(scope.media);
                }
              }
              return scope.hideUI = false;
            }, countdownTime + 1000);
            scope.countdownText = parseInt(scope.countdown);
            countdownTick = setInterval(function () {
              return scope.$apply(function () {
                var nextTick;
                nextTick = parseInt(scope.countdownText) - 1;
                if (nextTick === 0) {
                  scope.countdownText = scope.captureMessage != null ? scope.captureMessage : 'GO!';
                  return clearInterval(countdownTick);
                } else {
                  return scope.countdownText = nextTick;
                }
              });
            }, 1000);
          } else {
          }
          return false;
        };
        scope.addFrame = function (context, url, callback) {
          var overlay;
          if (callback == null) {
            callback = false;
          }
          overlay = new Image();
          overlay.onload = function () {
            context.drawImage(overlay, 0, 0, scope.width, scope.height);
            if (callback) {
              return callback(context);
            }
          };
          overlay.crossOrigin = '';
          return overlay.src = url;
        };
        scope.$watch('media', function (newVal) {
          if (newVal != null) {
            return scope.packagedMedia = scope.media.replace(/^data:image\/\w+;base64,/, '');
          }
        });
        scope.$watch('overlaySrc', function (newVal, oldVal) {
          var preloader;
          if (scope.overlaySrc != null) {
            scope.isLoaded = false;
            preloader = new Image();
            preloader.crossOrigin = '';
            preloader.src = newVal;
            return preloader.onload = function () {
              return scope.$apply(function () {
                return scope.isLoaded = true;
              });
            };
          } else {
            return scope.isLoaded = true;
          }
        });
        scope.$watch('enabled', function (newVal, oldVal) {
          if (newVal) {
            if (!oldVal) {
              return scope.enableCamera();
            }
          } else {
            if (oldVal != null) {
              return scope.disableCamera();
            }
          }
        });


        function dataURItoBlob(dataURI) {
          // convert base64/URLEncoded data component to raw binary data held in a string
          var byteString;
          if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataURI.split(',')[1]);
          else
            byteString = unescape(dataURI.split(',')[1]);

          // separate out the mime component
          var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

          // write the bytes of the string to a typed array
          var ia = new Uint8Array(byteString.length);
          for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }

          return new Blob([ia], {type: mimeString});
        }

        scope.uploading = {};
        scope.uploadedImage = scope.$parent.item.image;

        scope.retakePicture = function(){
          scope.uploadedImage = '';
        }

        scope.captureCallback = function (dataURI) {

          if (!dataURI) return;

          var file = dataURItoBlob(dataURI);

          scope.upload = $upload.upload({
            url: "https://api.cloudinary.com/v1_1/" + $.cloudinary.config().cloud_name + "/upload",
            data: {
              upload_preset: $.cloudinary.config().upload_preset,
            },
            file: file
          }).progress(function (e) {
            scope.uploading.progress = Math.round((e.loaded * 100.0) / e.total);
            scope.uploading.status = "Uploading... " + file.progress + "%";
          }).success(function (data, status, headers, config) {
            console.log('uploaded!!!', data);
            scope.uploadedImage = data.url;
            scope.$parent.item.image = data.url;
            $('#imageUploader').addClass('ng-dirty');
            $timeout(function(){
              scope.close();
            }, 1000);
          });
        };

        scope.close = function(){
          scope.$parent.displayUploader(false);
        }

        return scope.$watch('type', function () {
          switch (scope.type) {
            case 'photo':
              if (scope.enabled) {
                return scope.enableCamera();
              }
              break;
            default:
              if (scope.enabled) {
                return scope.enableCamera();
              }
          }
        });
      }
    };
  }
  ]);
