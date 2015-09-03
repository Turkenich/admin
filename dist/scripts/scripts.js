var Utils = {
  isHeroku: (document.location.host.search('herokuapp.com') > -1),
  findIdInArray: function (arr, idVal, idKey) {
    if (typeof idKey == 'undefined') idKey = '_id';
    for (var i = 0, a; a = arr[i]; i++) {
      if (a[idKey] == idVal) {
        return a;
      }
    }
    return false;
  }
}

var Consts = {
  OunceToGrams: 28.3495,
  api_root: (Utils.isHeroku ? 'https://turkenich-api.herokuapp.com/' : 'http://localhost:3000/'),
}

function yo(title, data) {
  console.log(title, data);
}

Array.prototype.findById = function (idVal, idKey) {
  if (typeof idKey == 'undefined') idKey = '_id';
  for (var i = 0, a; a = this[i]; i++) {
    if (a[idKey] == idVal) {
      return a;
    }
  }
  return {};
}

Array.prototype.findIndexById = function (idVal, idKey) {
  if (typeof idKey == 'undefined') idKey = '_id';
  for (var i = 0, a; a = this[i]; i++) {
    if (a[idKey] == idVal) {
      return i;
    }
  }
  return -1;
}

Array.prototype.findNextById = function (idVal, idKey) {
  if (typeof idKey == 'undefined') idKey = '_id';
  var res = {};
  for (var i = 0, a; a = this[i]; i++) {
    if (a[idKey] > idVal) {
      if (!res[idKey] || a[idKey] < res[idKey]) {
        res = a;
      }
    }
  }
  return res;
}

Array.prototype.findPrevById = function (idVal, idKey) {
  if (typeof idKey == 'undefined') idKey = '_id';
  var res = {};
  for (var i = 0, a; a = this[i]; i++) {
    if (a[idKey] < idVal) {
      if (!res[idKey] || a[idKey] > res[idKey]) {
        res = a;
      }
    }
  }

  return res;
}

String.prototype.isJson = function (text) {
  if (/^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@').
      replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
      replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

    //the json is ok
    return true;
  } else {

    //the json is not ok
    return false;

  }
}

Number.prototype.two = function () {
  var n = parseInt(this * 100) / 100;
  var arr = String(n).split('.');
  if (!arr[1] || arr[1]==='00') {
    return arr[0];
  } else {
    return arr[0] + '.' + arr[1].slice(0,2);
  }
}

'use strict';

angular
  .module('adminApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'angularFileUpload',
    'cloudinary',
    'ui.bootstrap',
    'ui.bootstrap.tpls',
    'ui.bootstrap.transition',
    'ngClipboard'
  ])
  .config(['$routeProvider', '$httpProvider', 'ngClipProvider', function ($routeProvider, $httpProvider, ngClipProvider) {
    $httpProvider.interceptors.push(function() {
      return {
        'request': function(config) {

          if (
            (config.url.indexOf('://turkenich') >= 0) ||
            (config.url.indexOf('://localhost') >= 0) ||
            (config.url.indexOf('://127.0.0.1') >= 0)
          ) {
            config.headers.Authorization = (localStorage['Authorization']);
          }
          return config;
        }
      };
    });

    ngClipProvider.setPath("images/ZeroClipboard.swf");
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      }).
      when('/upload', {
        templateUrl: 'views/partials/photo-upload.html',
        controller: 'photoUploadCtrl'
      })
      .when('/settings', {
        templateUrl: 'views/settings.html',
        controller: 'SettingsCtrl',
        reloadOnSearch: false
      })
      .when('/orders', {
        templateUrl: 'views/orders.html',
        controller: 'OrdersCtrl',
        reloadOnSearch: false
      })
      .when('/orders/:id', {
        templateUrl: 'views/order.html',
        controller: 'OrdersCtrl',
        reloadOnSearch: false
      })

      .when('/models', {
        templateUrl: 'views/models.html',
        controller: 'ModelsCtrl',
        reloadOnSearch: false
      })
      .when('/models/:id', {
        templateUrl: 'views/model.html',
        controller: 'ModelsCtrl',
        reloadOnSearch: false
      })

      .when('/elements', {
        templateUrl: 'views/elements.html',
        controller: 'ElementsCtrl',
        reloadOnSearch: false
      })
      .when('/elements/:id', {
        templateUrl: 'views/element.html',
        controller: 'ElementsCtrl',
        reloadOnSearch: false
      })

      .when('/prices', {
        templateUrl: 'views/prices.html',
        controller: 'PricesCtrl',
        reloadOnSearch: false
      })
      .when('/prices/:id', {
        templateUrl: 'views/price.html',
        controller: 'PricesCtrl',
        reloadOnSearch: false
      })

      .when('/coatings', {
        templateUrl: 'views/coatings.html',
        controller: 'CoatingsCtrl'
      })
      .when('/coatings/:id', {
        templateUrl: 'views/coating.html',
        controller: 'CoatingsCtrl'
      })
      .when('/materials', {
        templateUrl: 'views/materials.html',
        controller: 'MaterialsCtrl'
      })
      .when('/materials/:id', {
        templateUrl: 'views/material.html',
        controller: 'MaterialsCtrl'
      })
      .when('/providers', {
        templateUrl: 'views/providers.html',
        controller: 'ProvidersCtrl'
      })
      .when('/providers/:id', {
        templateUrl: 'views/provider.html',
        controller: 'ProvidersCtrl'
      })
      .when('/elementFeatures', {
        templateUrl: 'views/elementFeatures.html',
        controller: 'ElementFeaturesCtrl'
      })
      .when('/elementFeatures/:id', {
        templateUrl: 'views/elementFeature.html',
        controller: 'ElementFeaturesCtrl'
      })
      .when('/elementTypes', {
        templateUrl: 'views/elementTypes.html',
        controller: 'ElementTypesCtrl'
      })
      .when('/elementTypes/:id', {
        templateUrl: 'views/elementType.html',
        controller: 'ElementTypesCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);

/*
Copyright (c) 2013, Goldark SS LTDA <http://www.goldark.co>
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
-Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
-Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the 
documentation and/or other materials provided with the distribution.
-Neither the name of the Goldark nor the names of its contributors may be used to endorse or promote products derived from this software 
without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, 
THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE 
LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE 
GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT 
LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY 
OF SUCH DAMAGE.
*/

/*
This module is based in the firefox jsonview extenrsion made by Ben Hollis: https://github.com/bhollis/jsonview/
*/
'use strict';

angular.module('adminApp')
.directive('jsonExplorer', ['$http', function ($http) {
	return {
		restrict: 'E',
		scope: {
			jsonData: '@',
		},
		link: function (scope, elem, attrs) {
			attrs.$observe('jsonData', function (val) {
				var output = '';
				var formatter = {};
				formatter.jsString = function (s) {
					var has = {
      					'\b': 'b',
      					'\f': 'f',
      					'\r': 'r',
      					'\n': 'n',
      					'\t': 't'
    				}, ws;
    				for (ws in has) {
      					if (-1 === s.indexOf(ws)) {
        					delete has[ws];
      					}
    				}
    				
    				s = JSON.stringify({a:s});
    				s = s.slice(6, -2);
    				for (ws in has) {
      					s = s.replace(new RegExp('\\\\u000' + (ws.charCodeAt().toString(16)), 'ig'),
                    		'\\' + has[ws]);
    				}

    				return this.htmlEncode(s);
				};
				formatter.htmlEncode =  function (t) {
						if (t == null) {
							return '';
						}
    					return t.toString().replace(/&/g,"&amp;")
    						.replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  					};
				formatter.decorateWithSpan = function (value, className) {
					return '<span class="' + className + '">' + this.htmlEncode(value) + '</span>';
				};
				formatter.arrayToHtml = function (json) {
					var hasContents = false;
    				var output = '';
    				var numProps = 0;
    
    				for (var prop in json ) {
      					numProps++;
    				}

    				for (var prop in json) {
      					hasContents = true;
      					output += '<li>' + this.valueToHtml(json[prop]);
      					if (numProps > 1) {
       						output += ',';
      					}
      					output += '</li>';
      					numProps--;
    				}
    
    				if (hasContents) {
      					output = '[<ul class="array collapsible">' + output + '</ul>]';
    				} else {
      					output = '[ ]';
    				}
        			return output;
				};

				formatter.objectToHtml = function (json) {
					var hasContents = false;
    				var output = '';
    				var numProps = 0;
    				for (var prop in json ) {
      					numProps++;
    				}

    				for (var prop in json) {
      					hasContents = true;
      					output += '<li>' + 
      					'<span class="prop"><span class="q">"</span>' + this.jsString(prop) +
                			'<span class="q">"</span></span>: ' + this.valueToHtml(json[prop]);
	      				if (numProps > 1) {
	        				output += ',';
	      				}
	      				output += '</li>';
	      				numProps--;
    				}
    
	    			if (hasContents) {
	      				output = '{<ul class="obj collapsible">' + output + '</ul>}';
	    			} else {
	      				output = '{ }';
	    			}
	    
	    			return output;
				};
				
				formatter.valueToHtml = function (value) {
					var type = value && value.constructor;
					var output = '';

					if (value == null) {
						output += this.decorateWithSpan('null', 'null');
					}

					if (value && type == Array) {
						output += this.arrayToHtml(value);
					}

					if (value && type == Object) {
						output += this.objectToHtml(value);
					}

					if (type == Number) {
						output += this.decorateWithSpan(value, 'num');
					}

					if (type == String) {
						if (/^(http|https|file):\/\/[^\s]+$/i.test(value)) {
        					output += '<a href="' + value + '"><span class="q">"</span>' + 
        						this.jsString(value) + '<span class="q">"</span></a>';
      					} else {
        					output += '<span class="string">"' + this.jsString(value) + '"</span>';
      					}
					}

					if (type == Boolean) {
						output += this.decorateWithSpan(value, 'bool');
					}

					return output;
				};
				formatter.jsonToHtml = function (json) {
					return '<div class="gd-ui-json-explorer">' + this.valueToHtml(json) + '</div>';
				};
				
				var json = JSON.parse(val || '{}');
				var x = formatter.jsonToHtml(json);
				elem.html(x);
				function collapse (evt) {
					var collapser = evt.target;
    				var target = collapser.parentNode.getElementsByClassName('collapsible');
    
    				if (!target.length) {
      					return;
    				}

    				target = target[0];

    				if (target.style.display == 'none') {
				      var ellipsis = target.parentNode.getElementsByClassName('ellipsis')[0];
				      target.parentNode.removeChild(ellipsis);
				      target.style.display = '';
				      collapser.innerHTML = '-';
    				} else {
    				  target.style.display = 'none';
				   	  var ellipsis = document.createElement('span');
				      ellipsis.className = 'ellipsis';
				      ellipsis.innerHTML = ' &hellip; ';
				      target.parentNode.insertBefore(ellipsis, target);
				      collapser.innerHTML = '+';
    				}
				}
				
				var collections = angular.element(elem)[0].getElementsByTagName('ul');
				for (var i = 0; i < collections.length; i++) {
					var collectionItem = collections[i];
					if (collectionItem.className.indexOf('collapsible') != -1) {
						if (collectionItem.parentNode.nodeName == 'LI') {
							var collapser = document.createElement('div');
							collapser.className = 'collapser';
							collapser.innerHTML = '-';
							collapser.addEventListener('click', collapse, false);
							collectionItem.parentNode.insertBefore(collapser, collectionItem.parentNode.firstChild);
						}						
					}
				}
			});
      	}
    }
}]);
'use strict';

/**
 * @ngdoc directive
 * @name adminApp.directive:dynamicInput
 * @description
 * # dynamicInput
 */
angular.module('adminApp')
  .directive('dynamicInput', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
    return {
      restrict: 'E',
      scope: {
        type: '@',
        model: '=',
        placeholder: '=',
        item: '=',
        name: '@',
        desc: '@',
        options: '=',
      },
      template: function (element) {
        var tmpl = '' +
          '<div class="form-group tile">' +
          '<label for="{{id}}" class="control-label" title="{{placeholder}}">{{name}}</label>' +
          '<a ng-show="name && desc" tabindex="0" role="button" class="fa fa-info-circle tile-info"  data-toggle="popover"  data-trigger="focus" data-placement="top" data-content="{{desc}}"></a>'

        switch (element.attr('type')) {
          case 'date':
            if (element.attr('locked')) {
              tmpl += '<span class="form-control" id="{{id}}" type="text">{{model | date:\'dd/MM/yyyy\'}}</span>';
            } else {
              tmpl += '<textarea class="form-control" id="{{id}}" type="text">{{model | date:\'dd/MM/yyyy\'}}</textarea>';
            }
            break;
          case 'select':
            tmpl += '<select class="form-control" id="{{id}}" ng-model="model" placeholder="{{placeholder}}" ng-change="measureUnitsChanged()" ng-options="option.name  for option in options track by option._id " >' +
            '<option value="" selected>--------</option>' +
            '</select>';
            break;
          case 'textarea':
            tmpl += '<textarea class="form-control" id="{{id}}" ng-model="model" placeholder="{{placeholder}}"/>';
            break;
          case 'image':
            tmpl += '<input class="form-control" id="{{id}}" type="text" ng-model="model" placeholder="{{placeholder}}" style="height:0px; padding:0px; visibility: hidden;"/>' +
            '<a  ng-click="displayUploader(true);" id="imageUploader" class="thumbnail" style="malrgin: -15px 0 0 0;"><img ng-src="{{model || \'/images/default_image.png\'}}" alt="..."></a>' +
            '<image-uploader ng-if="showUploader" type="photo" enabled="true" width="640"height="480" model="model"></image-uploader>'
            break;
          default:
            if (element.attr('locked')) {
              tmpl += '<span class="form-control" id="{{id}}" type="text">{{model | number:2}}</span>';
            } else {
              tmpl += '<input class="form-control" id="{{id}}" type="{{type}}" ng-model="model" placeholder="{{placeholder}}"/>';
            }
            break;
        }

        //tmpl += '<p class="help-block"></p>' +
        '</div>';

        return tmpl;
      },
      link: function postLink(scope, element, attrs) {
        scope.id = attrs.type + '_' + attrs.name.replace(/'/g, "");
        scope.placeholder = scope.placeholder ? scope.placeholder : scope.desc;

        scope.showUploader = $rootScope.showUploader;
        scope.displayUploader = function (status) {
          $rootScope.showUploader = status;
          scope.showUploader = $rootScope.showUploader;
        }

        //pre select existing value in select boxes
        scope.$watch('model', function (newVal, oldVal) {
          if (newVal) {
            if (element.attr('type') == 'select') {
              $timeout(function () {
                if (angular.isObject(scope.model)) {
                  scope.model = scope.options.findById(scope.model._id);
                } else {
                  scope.model = scope.options.findById(scope.model);
                }
              });
            }
          }
        });

        $(function () {
          $('[data-toggle="popover"]').popover()
        })

        scope.measureUnitsChanged = function () {
          scope.$emit('measureUnitsChanged');
        }
      }
    }
  }]);

'use strict';

/**
 * @ngdoc directive
 * @name adminApp.directive:dynamicInput
 * @description
 * # dynamicInput
 */
angular.module('adminApp')
  .directive('dynamicFilter', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
    return {
      restrict: 'E',
      scope: {
        type: '@',
        model: '@',
        name: '@',
        desc: '@',
        options: '=',
        range: '@'
      },
      template: function (element) {
        var tmpl = '' +
          '<div class="form-group tile {{range}}">' +
          '<label for="{{id}}" class="control-label {{range}}" title="{{desc}}">{{name}}</label>' +
          '<i class="fa fa-info-circle tile-info {{range}}" data-container="body" data-toggle="popover"  data-trigger="focus" data-placement="top" data-content="{{desc}}"></i>';

        switch (element.attr('type')) {
          case 'select':
            tmpl += '<select class="form-control" id="{{id}}" ng-model="filter" placeholder="{{desc}}" ng-change="updateFilter()" ng-options="option.name  for option in options track by option._id " >' +
            '<option value="" selected>--------</option>' +
            '</select>';
            break;
          case 'parent':
            tmpl += '<select class="form-control" id="{{id}}" ng-model="filter" placeholder="{{desc}}" ng-change="updateFilter()" ng-options="option.name  for option in options track by option._id " >' +
            '<option value="" selected>--------</option>' +
            '</select>';
            break;
          case 'textarea':
            tmpl += '<textarea class="form-control" id="{{id}}" ng-model="filter" placeholder="{{desc}}" ng-change="updateFilter()"/>';
            break;
          case 'date':
            tmpl += '<p class="input-group {{range}}">' +
            '<input type="text" class="form-control ltr-datepicker {{range}}" datepicker-popup="dd/MM/yy" ng-model="filter" is-open="opened" close-text="Close"  ng-change="updateFilter()" />' +
            '<span class="input-group-btn">' +
            '<button type="button" class="btn btn-default {{range}}" ng-click="open($event)"><i class="glyphicon glyphicon-calendar"></i></button>' +
            '</span>' +
            '</p>';

            break;

          default:
            tmpl += '<input class="form-control {{range}}" id="{{id}}" type="{{type}}" placeholder="{{desc}}" ng-model="filter" ng-change="updateFilter()"/>';
            break;
        }

        //tmpl += '<p class="help-block"></p>' +
        '</div>';

        return tmpl;
      },
      link: function postLink(scope, element, attrs) {
        scope.id = attrs.model.replace(/'/g, "");

        scope.updateFilter = function () {
          if (scope.type == 'parent'){
            if (!scope.filter) {
              $rootScope.filter['_id']=null;
              return;
            }
            $rootScope.filter['_id'] = JSON.parse(scope.filter._id);
          }else{
            var suffix='';
            if (angular.isUndefined(scope.range)) {
              suffix='';
            }else{
              suffix = '_' + scope.range;
            }
            if (scope.filter){
              $rootScope.filter[scope.id + suffix] = scope.filter;
            }else{
              delete $rootScope.filter[scope.id + suffix];
            }
          }
          console.log('filter updated', $rootScope.filter);
        }

        scope.open = function($event) {
          $event.preventDefault();
          $event.stopPropagation();
          scope.opened = true;
        };

        scope.$watch('options', function (newVal, oldVal) {
          if (newVal) {
            if (element.attr('type') == 'select') {
              if (angular.isDefined(scope.options) && scope.options[0] && !scope.model) {
                scope.model = scope.options[0];
              }
            }
          }
        });


      }
    };
  }]);

'use strict';

/**
 * @ngdoc directive
 * @name adminApp.directive:dynamicInput
 * @description
 * # dynamicInput
 */
angular.module('adminApp')
  .directive('listItem', ['$rootScope', '$location', function ($rootScope, $location) {
    return {
      restrict: 'E',
      scope: {
        index: '=',
        item: '=',
        path: '@',
        addto: '=',
      },
      templateUrl: 'views/partials/listItem.html',
      link: function postLink(scope, element, attrs) {
        scope.removeItem = scope.$parent.removeItem;
        scope.moveItemUp = scope.$parent.moveItemUp;
        scope.moveItemDown = scope.$parent.moveItemDown;

        //scope.item.smallImage = function(){
        if (scope.item.image) {
          var splitted = scope.item.image.split('/');
          splitted[splitted.length-2] = 'c_fill,g_center,h_120,w_160';
          scope.item.small_image = splitted.join('/');
        }else if (angular.isDefined(scope.item.image)) {
          scope.item.small_image = 'images/placeholder.png';

        }

        switch (scope.path) {
          case
          'elements'
          :
            scope.parentPath = 'models';
            break;
          case
          'models'
          :
            scope.parentPath = 'orders';
            break;
          default :
            scope.parentPath = false;
        }

        if (scope.addto) {
          scope.link = '#/' + scope.parentPath + '/' + scope.addto + '?addId=' + scope.item._id;
        } else {
          scope.link = '#/' + scope.path + '/' + scope.item._id;
        }
      }
    }
      ;
  }])
;

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
        files: '=',
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


        scope.$watch('files', function() {
          if (!scope.files) return;
          scope.files.forEach(function(file){
            scope.upload = $upload.upload({
              url: "https://api.cloudinary.com/v1_1/" + $.cloudinary.config().cloud_name + "/upload",
              data: {
                upload_preset: $.cloudinary.config().upload_preset,
              },
              file: file
            }).progress(function (e) {
              file.progress = Math.round((e.loaded * 100.0) / e.total);
              file.status = "Uploading... " + file.progress + "%";
            }).success(function (data, status, headers, config) {
              console.log('uploaded!!!', data);
              scope.uploadedImage = data.secure_url;
              scope.$parent.item.image = data.secure_url;
              $('#imageUploader').addClass('ng-dirty');
              $timeout(function(){
                scope.close();
              }, 1000);
              //$rootScope.photos = $rootScope.photos || [];
              //data.context = {custom: {photo: scope.title}};
              //file.result = data;
              //$rootScope.photos.push(data);
            });
          });
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
        scope.uploadedImage = (scope.$parent && scope.$parent.item && scope.$parent.item.image) ? scope.$parent.item.image : "";

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
            scope.uploadedImage = data.secure_url;
            scope.$parent.item.image = data.secure_url;
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

'use strict';

/**
 * @ngdoc directive
 * @name adminApp.directive:modal
 * @description
 * # modal
 */
angular.module('adminApp').controller('ModalInstanceCtrl', function ($scope, $modalInstance, ok, cancel) {

  $scope.ok = function () {
    $modalInstance.close('ok');
    if (typeof ok == "function") ok();
  };

  $scope.cancel = function () {
    $modalInstance.close('cancel');
    if (typeof cancel == "function") cancel();
  };
});


/*
angular.module('adminApp')
  .directive('modal', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the modal directive');
      }
    };
  });
*/

'use strict';

angular.module('adminApp')
  .controller('RootCtrl', ['$rootScope', '$scope', '$cookies', '$sce', '$timeout', '$http', '$location', '$window', '$interval', '$modal', 'ElementTypes', 'Materials', 'Coatings', 'ElementFeatures', 'Providers', 'Prices',
    function ($rootScope, $scope, $cookies, $sce, $timeout, $http, $location, $window, $interval, $modal, ElementTypes, Materials, Coatings, ElementFeatures, Providers, Prices) {

      $rootScope.version = 'GRUNT_VERSION';
      console.log('VERSION: ' + $rootScope.version);

      $rootScope.exportType = '';

      $scope.authenticate = function () {
        $http.get(Consts.api_root + 'authenticate').
          success(function (data, status, headers, config) {
            $scope.authenticated = true;
            $rootScope.init();
            console.log('authenticated', data);
          }).
          error(function (data, status, headers, config) {
            $scope.authenticated = false;
          });
      }

      $rootScope.dbloading = false;
      $rootScope.checkDdbloading = function () {
        $rootScope.elementTypes.$promise.then(function () {
          yo('loading elementTypes', $rootScope.elementTypes);
          $rootScope.dbloading = false;
        });
        $rootScope.materials.$promise.then(function () {
          yo('loading materials', $rootScope.materials);
          $rootScope.dbloading = false;
        });
        $rootScope.providers.$promise.then(function () {
          yo('loading providers', $rootScope.providers);
          $rootScope.dbloading = false;
        });
        $rootScope.coatings.$promise.then(function () {
          yo('loading coatings', $rootScope.coatings);
          $rootScope.dbloading = false;
        });
        $rootScope.elementFeatures.$promise.then(function () {
          yo('loading elementFeatures', $rootScope.elementFeatures);
          $rootScope.dbloading = false;
        });
        $rootScope.currencies.$promise.then(function () {
          yo('loading currencies', $rootScope.currencies);
          $rootScope.dbloading = false;
        });
        if ($rootScope.anyDbloading) {
          $rootScope.dbloading = false;
        }
        $rootScope.dbloading = true;
      }

      $rootScope.init = function () {

        console.log('rootScope init');

        $scope.updateBreadcrumbs();
        $rootScope.saving = false;
        $rootScope.elementTypes = ElementTypes.all();
        $rootScope.materials = Materials.all();
        $rootScope.providers = Providers.all();
        $rootScope.coatings = Coatings.all();
        $rootScope.elementFeatures = ElementFeatures.all();
        $rootScope.currencies = Prices.all(function (currencies) {
          $rootScope.currencies = currencies;
          $rootScope.coins = [];
          for (var i = 0; i < currencies.length; i++) {
            if (currencies[i].code == 'TIME') continue;
            $rootScope.coins.push(currencies[i]);
          }
        });
        $rootScope.checkDdbloading();
      }

      $rootScope.measureUnits = [
        {name: "גרם", _id: 'gram'},
        {name: "סנטימטר", _id: 'centimeter'},
        {name: "יחידה", _id: 'unit'},
      ]

      $rootScope.weightUnits = [
        {name: "אונקייה", _id: 'ounce', grams: 31.104},
        {name: "גרם", _id: 'gram', grams: 1},
        {name: "קילוגרם", _id: 'kilo', grams: 1000},
      ]

      $scope.logout = function () {
        localStorage['Authorization'] = "";
        document.location.reload();
      }

      $scope.changePassword = function () {
        localStorage['Authorization'] = md5($('input#password').val());
        document.location.reload();
      }

      $scope.alert = '';
      $scope.alertClass = '';
      $scope.showAlert = function (text, type) {
        $timeout(function () {
          $scope.alertClass = type || 'warning';
          $scope.alert = text;
          $scope.alertIsShown = true;
        });
        $timeout(function () {
          $scope.alertIsShown = false;
        }, 3000);

      }
      $scope.connected = false;
      $scope.waitForConnection = $interval(function () {
        $http.get(Consts.api_root + 'ping').
          success(function (data, status, headers, config) {
            $('.loader').css('opacity', 0);
            $interval.cancel($scope.waitForConnection);
            $scope.authenticate();
            $timeout(function () {
              $('.loader').remove();
            }, 2000);
          }).
          error(function (data, status, headers, config) {
          });
      }, 2000);


      $scope.updateBreadcrumbs = function (name, path, item) {
        $rootScope.location = path;
        $rootScope.breadcrumbs = [{name: 'ראשי', link: '#/'}];
        if (!name || !path) return;
        $rootScope.breadcrumbs.push({
          name: name, link: '#/' + path
        });
        if (item) {
          $rootScope.breadcrumbs.push({
            name: (item.code || item.name || item.desc), link: '#/' + path + '/' + item._id
          });
        }
      }

      $scope.setSaving = function (val) {
        $rootScope.saving = val;
      }

      $scope.goBack = function (delay) {
        $timeout(function () {
          var path = $location.path().split('/');
          path.splice(path.length - 1, 1);
          $location.path(path.join('/'));
          //window.history.back();
        }, (delay || 0))
      }
      $scope.trustUrl = function (url) {
        return $sce.trustAsResourceUrl(url);
      }

      $scope.getFromJson = function (str, id) {
        if (!str || !str.isJson) {
          return '';
        }
        var tot = 0;
        var jsn = JSON.parse(str);
        for (var i in jsn){
          if (!jsn.hasOwnProperty(i)) return;
          if (i.indexOf(id) >= 0){
            tot += Number(jsn[id]);
          }
        }
        return tot;
      }

      $scope.spreadJson = function (str) {
        if (!str || !str.isJson) {
          return '';
        }
        var flds = {};
        var jsn = JSON.parse(str);
        for (var i in jsn){
          if (!jsn.hasOwnProperty(i)) return;
          flds[i] = true;
        }
        var spread = [];
        for (var i in flds){
          if (!flds.hasOwnProperty(i)) return;
          spread.push(i);
        }
        console.log('spread', spread);
        return spread;
      }

      $scope.spreadJsons = function (parent, field) {
        var flds = {};

        for (var child, c=0; child = parent[c]; c++) {
          var str = child[field];
          if (!str || !str.isJson) {
            continue;
          }
          var jsn = JSON.parse(str);
          for (var i in jsn) {
            if (!jsn.hasOwnProperty(i)) return;
            flds[i] = true;
          }
        }
        var spread = [];
        for (var i in flds){
          if (!flds.hasOwnProperty(i)) return;
          spread.push(i);
        }
        console.log('spreads', spread);
        return spread;
      }

      $rootScope.reloadItemImp = function (scope, Model, item, callback) {
        if (item && item['_id']) {
          scope.item = Model.query({'id': item['_id']}, function () {
            if (angular.isFunction(callback)) callback(scope.item);
          });
        } else {
          scope.items = Model.all({}, function () {
            if (angular.isFunction(callback)) callback(scope.items);
          });
        }
      }

      $rootScope.updateItemImp = function (scope, Model, item, callback) {
        console.log('updating', item);
        Model.update(item, function (_item) {
          console.log('updated', _item);
          $('.ng-dirty').removeClass('ng-dirty');
          $scope.showAlert('הפריט נשמר בהצלחה');
          if (angular.isFunction(callback)) callback(_item);
          if ($rootScope.saving) {
            $scope.setSaving('false');
            window.history.back();
          }
        }, function () {
          $scope.showAlert('אירעה שגיאה בשמירת הפריט - נא לנסות שנית');
          $scope.setSaving('false');
        });
      }
      $rootScope.removeItemImp = function (scope, Model, item, callback) {
        $scope.openModal('confirmDelete', function () {
          if (confirm('האם אתה בטוח שברצונך למחוק את הפריט?')) {
            console.log('deleting', item);
            Model.remove({id: item._id}, function () {
              $scope.showAlert('הפריט נמחק בהצלחה');
              if (angular.isFunction(callback)) callback(item);
            });
            if (scope.items && scope.items.length > 0) {
              var i = scope.items.findIndexById(item._id);
              scope.items.splice(i, 1);
            }
          }
        }, function () {
          console.log('CANCELED')
        });
      }
      $rootScope.addItemImp = function (scope, Model, item, callback) {
        if (item) {
          Model.create(item, function (item) {
            if (angular.isFunction(callback)) callback(item);
          });
        } else {
          Model.create(function (item) {
            if (angular.isFunction(callback)) callback(item);
          });
        }
      }

      $rootScope.moveItemImp = function (scope, Model, items, item, dir, callback) {
        //var index = items.findIndexById(item._id, '_id');
        if (dir > 0) var item1 = items.findNextById(item.pos, 'pos');
        else if (dir < 0) var item1 = items.findPrevById(item.pos, 'pos');

        if (item && item1) {
          var tmp = item.pos;
          item.pos = item1.pos;
          item1.pos = tmp;
          $rootScope.updateItemImp(scope, Model, item, callback);
          $rootScope.updateItemImp(scope, Model, item1, callback);
        }
      }

      $rootScope.getPopulatedItemImp = function (scope, Model, item, callback) {
        Model.query({'id': item['_id']}, function (item) {
          if (angular.isFunction(callback)) callback(item);
        });
      }

      $scope.exportToCsv = function (item, title) {
        $scope.exportJson(item, 'element', true);
        //$rootScope.getPopulatedItemImp($scope, Elements, item, function (item) {
        //});
      }

      $scope.clearForm = function () {
        $('.form-control').val('').text('');
        $rootScope.filter = {};
      }

      $rootScope.sort = 'name';
      $rootScope.desc = false;
      $rootScope.sortBy = function (name) {
        $rootScope.sort = name;
        $rootScope.desc = !(name == 'name');
      }
      $rootScope.isSortedBy = function (name) {
        return $rootScope.sort == name;
      }

      $rootScope.location = 'main';
      $rootScope.locationIs = function (name) {
        return $rootScope.location == name;
      }

      $scope.openModal = function (template, ok, cancel) {
        var modalInstance = $modal.open({
          animation: true,
          templateUrl: 'views/partials/' + template + '.html?v=' + $rootScope.version,
          controller: 'ModalInstanceCtrl',
          resolve: {
            ok: function () {
              return ok;
            },
            cancel: function () {
              return cancel;
            }
          }
        });
      }


      $scope.noimage = 'images/noimage.jpg';

      $rootScope.showUploader = false;
      $rootScope.displayUploader = function (status) {
        $rootScope.showUploader = status;
      }


      $scope.elementsCost = function (model, elements, prices) {

        if (!elements || !elements.length) return;

        //console.log('calculating cost...');

        var cost = 0;
        var eleCost = 0;

        var providerWorkCost = 0;
        var elementFeatureCost = 0;
        var coatingCost = 0;
        var materialCost = 0;

        $rootScope.workCost = 0;
        $rootScope.providerWorkCost = 0;
        $rootScope.elementFeatureCost = 0;
        $rootScope.coatingCost = 0;
        $rootScope.materialCost = 0;
        $rootScope.materialsCost = {};

        var override;
        var currencies = [];
        for (var c, i = 0; c = $scope.currencies[i]; i++) {
          currencies.push(c);
          override = (prices.findById(c._id || c));
          if (override.newPrice) {
            currencies[currencies.length - 1].conversion = parseInt(override.newPrice);
          }
        }
        $rootScope.currenciesWithOverride = currencies;

        var materialsCost = {};
        model.eTypesCosts = {};

        //calc each element costs (material, work, waste, currency)
        for (var ele, e = 0; ele = elements[e]; e++) {

          //get ele weight in grams
          var eleWeight = (ele.measureUnitWeight || 0);
          var eleWeightIncludingWaste = (ele.measureUnitWeight || 0) / (1 - (ele.waste / 100 || 0));

          //material cost
          if ($rootScope.materials && ele.material) {
            var material = $rootScope.materials.findById(ele.material._id || ele.material);
            //get material price for gram
            var materialPrice = (material.price || 0);
            var materialWeight = ($rootScope.weightUnits.findById(material.weightUnit) || {}).grams || 1;
            var materialConversion = currencies.findById(material.currency).conversion || 0;

            override = (prices.findById(material._id));
            if (override && override.newPrice) {
              materialPrice = parseInt(override.newPrice);
            }

            //add to cost
            materialCost = eleWeightIncludingWaste * ele.amount * (materialPrice * materialConversion / materialWeight); //waste affects only the material calc

            materialCost = parseInt(materialCost * 100) / 100;
            $rootScope.materialCost += materialCost;
            if (!materialsCost[material._id]) {
              materialsCost[material._id] = materialCost;
            } else {
              materialsCost[material._id] += materialCost;
            }
          }
          //coating cost
          if ($rootScope.coatings && ele.coating) {
            var coating = $rootScope.coatings.findById(ele.coating._id || ele.coating);
            //get measure unit of the coating
            var coatingMeasureUnit = coating.measureUnit;
            var coatingPrice = (coating.price || 0);
            var coatingConversion = currencies.findById(coating.currency).conversion || 0;

            override = (prices.findById(coating._id));
            if (override && override.newPrice) {
              coatingPrice = parseInt(override.newPrice);
            }

            //add to cost
            if (coatingMeasureUnit == 'gram') {
              coatingCost = eleWeight * ele.amount * coatingPrice * coatingConversion;
            } else {
              coatingCost = ele.amount * coatingPrice * coatingConversion;
            }
            $rootScope.coatingCost += coatingCost;
          }
          //elementFeatures cost
          if ($rootScope.elementFeatures && ele.elementFeature) {
            var elementFeature = $rootScope.elementFeatures.findById(ele.elementFeature._id || ele.elementFeature);
            //get measure unit of the elementFeature
            var elementFeatureMeasureUnit = elementFeature.measureUnit;
            var elementFeaturePrice = (elementFeature.price || 0);
            var elementFeatureConversion = currencies.findById(elementFeature.currency).conversion || 0;

            override = (prices.findById(elementFeature._id));
            if (override && override.newPrice) {
              elementFeaturePrice = parseInt(override.newPrice);
            }

            //add to cost
            if (elementFeatureMeasureUnit == 'gram') {
              elementFeatureCost = eleWeight * ele.amount * elementFeaturePrice * elementFeatureConversion;
            } else {
              elementFeatureCost = ele.amount * elementFeaturePrice * elementFeatureConversion;
            }
            $rootScope.elementFeatureCost += elementFeatureCost;
          }
          //work cost

          //get the work cost per unit in ILS
          if ($rootScope.currencies && ele.workUnitCurrency) {
            var workUnitCurrency = $rootScope.currencies.findById(ele.workUnitCurrency._id || ele.workUnitCurrency);
            var workUnitPrice = ele.workUnitPrice * (workUnitCurrency.conversion || 0);
            override = (prices.findById(workUnitCurrency._id));
            if (override && override.newPrice) {
              workUnitPrice = ele.workUnitPrice * (override.newPrice || 0);
            }
            var workUnit = ele.workUnit;
            if (workUnit == 'gram') {
              providerWorkCost = eleWeight * ele.amount * workUnitPrice;
            } else {
              providerWorkCost = ele.amount * workUnitPrice || 0;
            }
            $rootScope.providerWorkCost += providerWorkCost;

          }

          //save cost by elementType
          eleCost = parseInt((providerWorkCost + elementFeatureCost + coatingCost + materialCost) * 100) / 100;

          if (ele.elementType) {
            var elementType = ($rootScope.elementTypes.findById(ele.elementType._id || ele.elementType) || {}).name;
            if (!model.eTypesCosts[elementType]) {
              model.eTypesCosts[elementType] = eleCost;
            } else {
              model.eTypesCosts[elementType] += eleCost;
            }
          }

        }

        //add work time
        var workTime = model.requiredTime || 0;
        var minutePrice = ($scope.currencies.findById('TIME', 'code').conversion || 0);
        override = (prices.findById('TIME', 'code'));
        if (override && override.newPrice) {
          minutePrice = (override.newPrice || 0);
        }

        $rootScope.workCost = (minutePrice || 0) * workTime;


        //Calc Total Cost
        $rootScope.workCost = parseInt($rootScope.workCost * 100) / 100;
        $rootScope.providerWorkCost = parseInt($rootScope.providerWorkCost * 100) / 100;
        $rootScope.elementFeatureCost = parseInt($rootScope.elementFeatureCost * 100) / 100;
        $rootScope.coatingCost = parseInt($rootScope.coatingCost * 100) / 100;
        $rootScope.materialCost = parseInt($rootScope.materialCost * 100) / 100;
        $rootScope.materialsCost = materialsCost;

        cost = parseInt(($rootScope.workCost + $rootScope.providerWorkCost + $rootScope.elementFeatureCost + $rootScope.coatingCost + $rootScope.materialCost) * 100) / 100;

        return cost;

      }

      $scope.elementsWeight = function (elements) {

        if (!elements || !elements.length) return;

        var materialsWeight = {};
        $rootScope.materialsWeight = {};

        //console.log('calculating weight...');

        var weight = 0;
        var totWeight = 0;

        //calc each element weight
        for (var ele, e = 0; ele = elements[e]; e++) {
          //get ele weight in grams
          weight = parseInt(ele.amount * (ele.measureUnitWeight || 0) * 100) / 100;

          var material = $rootScope.materials.findById(ele.material);
          if (!materialsWeight[material._id]) {
            materialsWeight[material._id] = weight;
          } else {
            materialsWeight[material._id] += weight;
          }
          totWeight += weight;
        }

        $rootScope.materialsWeight = materialsWeight;

        return totWeight;
      }

      $scope.$on('$locationChangeEnd', function (event) {
        $('.navbar-collapse.collapse').removeClass('in');
      });

      $scope.exportJson = function (JSONData, ReportTitle, ShowLabel) {
        //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
        var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
        arrData = typeof arrData != 'Array' ? [arrData] : arrData;

        var CSV = '';
        //Set Report title in first row or line

        CSV += ReportTitle + '\r\n\n';

        //This condition will generate the Label/Header
        if (ShowLabel) {
          var row = "";

          //This loop will extract the label from 1st index of on array
          for (var index in arrData[0]) {

            if ((index.charAt(0) == '_' || index.charAt(0) == '$')) continue;

            //Now convert each value to string and comma-seprated
            row += index + ',';
          }

          row = row.slice(0, -1);

          //append Label row with line break
          CSV += row + '\r\n';
        }

        //1st loop is to extract each row
        var val;
        for (var i = 0; i < arrData.length; i++) {
          var row = "";

          //2nd loop will extract each column and convert it in string comma-seprated
          for (var index in arrData[i]) {
            val = arrData[i][index];
            if (angular.isFunction(val)) continue;
            else if ((index.charAt(0) == '_' || index.charAt(0) == '$')) continue;
            else if (angular.isObject(val)) {
              val = val.name || val.desc;
            }


            row += '"' + val + '",';
          }

          row.slice(0, row.length - 1);

          //add a line break after each row
          CSV += row + '\r\n';
        }

        if (CSV == '') {
          alert("Invalid data");
          return;
        }

        //Generate a file name
        var fileName = "MyReport_";
        //this will remove the blank-spaces from the title and replace it with an underscore
        fileName += ReportTitle.replace(/ /g, "_");

        //Initialize file format you want csv or xls
        var uri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(CSV);

        // Now the little tricky part.
        // you can use either>> window.open(uri);
        // but this will not work in some browsers
        // or you will not get the correct file extension

        //this trick will generate a temp <a /> tag
        var link = document.createElement("a");
        link.href = uri;

        //set the visibility hidden so it will not effect on your web-layout
        link.style = "visibility:hidden";
        link.download = fileName + ".csv";

        //this part will append the anchor tag and remove it after automatic click
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      $rootScope.copiedTable = -1;
      $rootScope.exportTables = [];
      $rootScope.setCopiedTable = function (i) {
        $rootScope.watingTable = i;
      }
      $rootScope.getExportTables = function () {

        $rootScope.copiedTable = -1;

        var res = [];
        $.each($('.export-table'), function (i, table) {
          res.push({
            name: $(table).attr('title'),
            target: $(table).attr('data-target'),
          })
          $rootScope.exportTables = res;
        })
        $rootScope.exportTables = res;
      }
      $rootScope.newSpreadsheet = function () {
        $window.open('http://spreadsheets.google.com/ccc?new&hl=he');
      }

      $rootScope.getHtmlToCopy = function (target, idx) {

        $rootScope.copiedTable = -1;
        $rootScope.waitingTable = idx;


        function $chk(obj) {
          return !!(obj || obj === 0)
        }

        var copyConst = {rowSeperator: "\r\n", colSeperator: "\t"}

        var TableUtil = {
          nodeToString: function (table, rowSeperator, colSeperator) {
            var d = "";
            try {
              if (table.childNodes.length) {
                if ("TD" == table.nodeName || "TH" == table.nodeName) {
                  colSeperator = rowSeperator = "";
                }
                for (table = table.firstChild; table;) {
                  d += TableUtil.nodeToString(table, rowSeperator, colSeperator);
                  if ("TR" == table.nodeName) {
                    d += rowSeperator;
                  } else if ("TD" == table.nodeName || "TH" == table.nodeName) {
                    d += colSeperator;
                  }
                  table = table.nextSibling
                }
              } else {
                "#text" == table.nodeName && $chk(table.nodeValue) && "" !== table.nodeValue && (rowSeperator = table.nodeValue, colSeperator = RegExp("\\t", "g"), rowSeperator = rowSeperator.replace(RegExp("\\n", "g"), ""), rowSeperator = rowSeperator.replace(colSeperator, ""), d += rowSeperator.trim());
              }
            } catch (e) {
              $rootScope.copiedTable = -1;
              $rootScope.waitingTable = -1;
              console.log("getting html error", e);
            }
            return d;
          }
        };

        console.log('getting html to copy');
        var res = TableUtil.nodeToString($('table#' + target)[0], copyConst.rowSeperator, copyConst.colSeperator);
        console.log('got html to copy', res);

        $rootScope.copiedTable = idx;
        $rootScope.waitingTable = -1;

        return (res);
      }

      $scope.setExportFile = function (filename) {
        return $scope.exportFile = 'views/exports/' + filename + '.html';
      }
      $scope.exportTable = function (filename) {

        $timeout(function () {
          $scope.setExportFile(filename);
        });

        $timeout(function () {
          var tableToExcel = (function () {
            var uri = 'data:application/vnd.ms-excel;base64,'
              , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
              , base64 = function (s) {
                return window.btoa(unescape(encodeURIComponent(s)))
              }
              , format = function (s, c) {
                return s.replace(/{(\w+)}/g, function (m, p) {
                  return c[p];
                })
              }
            return function (table, name, filename) {
              if (!table.nodeType) table = document.getElementById(table)
              var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML}

              document.getElementById("dlink").href = uri + base64(format(template, ctx));
              document.getElementById("dlink").download = filename;
              document.getElementById("dlink").click();

            }
          })()

          tableToExcel('exportTable', 'export', 'export_filename.xls');
        }, 1000);
      }

      $rootScope.init();

    }]);

'use strict';

angular.module('adminApp')
  .controller('MainCtrl', ['$scope', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }]);

'use strict';

angular.module('adminApp')
  .controller('PricesCtrl', ['$scope', '$rootScope', '$routeParams', '$location', '$timeout', 'Prices',
    function ($scope, $rootScope, $routeParams, $location, $timeout, Prices) {

      $scope.reloadItem = function (item) {
        $rootScope.reloadItemImp($scope, Prices, item, function(){
          $scope.updateBreadcrumbs('מטבעות', 'prices', $scope.item);
        });
      }
      $scope.updateItem = function (item) {
        $rootScope.updateItemImp($scope, Prices, item, function(){
          $rootScope.init();
        });
      }
      $scope.removeItem = function (item) {
        $rootScope.removeItemImp($scope, Prices, item, function(){
          $location.path('/prices');
        });
      }
      $scope.addItem = function (item) {
        $rootScope.addItemImp($scope, Prices, null, function (item) {
          $location.path('/prices/' + item._id);
        });
      }

      $scope.duplicateItem = function (item) {
        $rootScope.tempItem = item;
        $rootScope.addItemImp($scope, Prices, null, function (item) {
          $location.path('/prices/' + item._id);
        });
      }

      $scope.moveItemDown = function(item){
        $rootScope.moveItemImp($scope, Prices, $scope.items, item, 1)
      }
      $scope.moveItemUp = function(item){
        $rootScope.moveItemImp($scope, Prices, $scope.items, item, -1)
      }


      //piece of code for item duplication
      if ($rootScope.tempItem) {
        $timeout(function () {
          $scope.item = $rootScope.tempItem;
          $scope.item['_id'] = $routeParams['id'];

          $rootScope.tempItem = null;
          $timeout(function () {
            $scope.updateItem($scope.item);
          })
        })
      } else {
        $scope.reloadItem({_id: $routeParams['id']});
      }

    }]);

'use strict';

angular.module('adminApp')
  .controller('SettingsCtrl', ['$scope', '$rootScope', '$routeParams', '$location', '$timeout', 'Settings',
    function ($scope, $rootScope, $routeParams, $location, $timeout, Settings) {

      $scope.reloadItem = function (item) {
        $rootScope.reloadItemImp($scope, Settings, item);
      }
      $scope.updateItem = function (item) {
        $rootScope.updateItemImp($scope, Settings, item);
      }
      $scope.removeItem = function (item) {
        $rootScope.removeItemImp($scope, Settings, item, function(){
          $location.path('/settings');
        });
      }
      $scope.addItem = function (item) {
        $rootScope.addItemImp($scope, Settings, null, function (item) {
          $location.path('/settings/' + item._id);
        });
      }

      $scope.duplicateItem = function (item) {
        $rootScope.tempItem = item;
        $rootScope.addItemImp($scope, Settings, null, function (item) {
          $location.path('/settings/' + item._id);
        });
      }

      $scope.moveItemDown = function(item){
        $rootScope.moveItemImp($scope, Settings, $scope.items, item, 1)
      }
      $scope.moveItemUp = function(item){
        $rootScope.moveItemImp($scope, Settings, $scope.items, item, -1)
      }


      //piece of code for item duplication
      if ($rootScope.tempItem) {
        $timeout(function () {
          $scope.item = $rootScope.tempItem;
          $scope.item['_id'] = $routeParams['id'];

          $rootScope.tempItem = null;
          $timeout(function () {
            $scope.updateItem($scope.item);
          })
        })
      } else {
        $scope.reloadItem({_id: $routeParams['id']});
      }

    }]);

'use strict';

angular.module('adminApp')
  .controller('OrdersCtrl', ['$scope', '$rootScope', '$routeParams', '$location', '$timeout', 'Elements', 'Models', 'Orders',
    function ($scope, $rootScope, $routeParams, $location, $timeout, Elements, Models, Orders) {

      $rootScope.init();

      $scope.reloadItem = function (item) {
        $rootScope.anyDbloading = true;
        $rootScope.reloadItemImp($scope, Orders, item, function () {
          $scope.parseModelsFromDb();
          $scope.parsePricesFromDb();
          $scope.updateBreadcrumbs('הזמנות', 'orders', $scope.item);
          $rootScope.anyDbloading = false;
        });
      }
      $scope.updateItem = function (item, asIs) {
        if (!asIs) item = $scope.setItemVars(item);
        $rootScope.updateItemImp($scope, Orders, item);
      }
      $scope.removeItem = function (item) {
        $rootScope.removeItemImp($scope, Orders, item, function () {
          $location.path('/orders');
        });
      }
      $scope.addItem = function (item) {
        $rootScope.addItemImp($scope, Orders, null, function (item) {
          $location.path('/orders/' + item._id);
        });
      }

      $scope.deleteUnnamedItems = function () {
        $scope.openModal('confirmDeleteUnnamed', function () {
          if (confirm('האם אתה בטוח שברצונך למחוק את הפריטים (זהירות בבקשה)?')) {
            var items = angular.copy($scope.items);
            for (var item, i = 0; item = items[i]; i++) {
              if (!item.name) {
                $scope.items.splice(i, 1);
                Orders.remove({id: item._id});
              }
            }
          }
        });
      }

      $scope.duplicateItem = function (item) {
        item = $scope.setItemVars(item);
        $rootScope.tempItem = item;
        $rootScope.addItemImp($scope, Orders, null, function (item) {
          $location.path('/orders/' + item._id);
        });
      }


      //piece of code for item duplication
      if ($rootScope.tempItem) {
        $scope.item = $rootScope.tempItem;
        $scope.item['_id'] = $routeParams['id'];

        $rootScope.tempItem = null;
        $timeout(function () {
          $scope.updateItem($scope.item, true);
          $scope.parseModelsFromDb();
          $scope.parsePricesFromDb();
        })
      } else {
        $scope.reloadItem({_id: $routeParams['id']});
      }

      var addId = $location.search()['addId'];

      $rootScope.filter = {};

      $scope.setItemVars = function (item) {
        item.models = $scope.parseModelsToDb();
        item.prices = $scope.parsePricesToDb();
        return item;
      }

      $scope.removeModel = function (model) {
        console.log('deleting', model);
        if ($scope.models && $scope.models.length > 0) {
          var i = $scope.models.findIndexById(model._id);
          $scope.models.splice(i, 1);
        }

        $scope.updateItem($scope.item);
      }

      $scope.zeroModel = function (model) {
        if ($scope.models && $scope.models.length > 0) {
          var i = $scope.models.findIndexById(model._id);
          $scope.models[i].amount = 0;
        }

        $scope.updateItem($scope.item);
      }

      $scope.moveItem = function (model, dir) {

        var model1;
        if (dir > 0) model1 = $scope.models.findNextById(model.pos, 'pos');
        else if (dir < 0) model1 = $scope.models.findPrevById(model.pos, 'pos');


        if (model && model1 && model1.pos >= 0) {
          var tmp = model.pos;
          model.pos = model1.pos;
          model1.pos = tmp;
        }

        $scope.updateItem($scope.item);

      }
      //private
      $scope.parseModelsFromDb = function () {

        if (!$scope.item) return;
        if (!$scope.item.models) $scope.item.models = "[]";

        var eles = JSON.parse($scope.item.models);

        if (addId) {
          var ele = eles.findIndexById(addId, 'id');
          if ((ele >= 0) && eles[ele]) {
            eles[ele].amount += 1;
          } else {
            eles.push({
              id: addId, amount: 1, pos: eles.length
            });
          }
        }

        $scope.models = [];
        for (var ele, e = 0; ele = eles[e]; e++) {
          Models.query({'id': ele['id']}, function (_model) {
            _model.amount = eles.findById(_model._id, 'id').amount || 0;
            _model.pos = eles.findById(_model._id, 'id').pos || 0;
            $scope.models.push(_model);

            if (addId && ($scope.models.length == eles.length)) {
              $scope.updateItem($scope.item);
              addId = false;
              $location.search({'addId': null});
            }

            if (($scope.models.length == eles.length)) {
              $scope.getOrderElements();
            }
          });
        }


      }


      $scope.parseModelsToDb = function () {

        if (!$scope.item || !$scope.item.models || !$scope.models) return;

        //fix position if needed
        var poss = [];
        var min_pos = 99999999;
        for (var ele, e = 0; ele = $scope.models[e]; e++) {
          if (!(ele.pos >= 0)) ele.pos = 0;
          while (poss[ele.pos]) {//this position already exist
            ele.pos++;
          }
          if (ele.pos < min_pos) min_pos = ele.pos;
          poss[ele.pos] = true;
        }

        var eles = [];
        for (var ele, e = 0; ele = $scope.models[e]; e++) {
          eles.push({
            id: ele._id, amount: ele.amount, pos: (ele.pos - min_pos)
          });
        }


        $scope.item.models = JSON.stringify(eles);
        return $scope.item.models;

      }

      $scope.parsePricesFromDb = function () {

        if (!$scope.item) return;
        if (!$scope.item.prices) $scope.item.prices = "[]";

        $scope.prices = [];
        for (var ele, e = 0; ele = $scope.currencies[e]; e++) {
          if (ele.code == 'ILS') continue; //ignore shekels
          ele.newPrice = null;
          ele.icon = 'ils';
          ele.fullname = ele.name;
          $scope.prices.push(ele);
        }
        for (var ele, e = 0; ele = $scope.materials[e]; e++) {
          ele.newPrice = null;
          ele.icon = ($rootScope.currencies.findById(ele.currency) || {}).code;
          ele.fullname = ele.name + ' (' + ($rootScope.weightUnits.findById(ele.weightUnit._id || ele.weightUnit) || {}).name + ')';
          $scope.prices.push(ele);
        }
        for (var ele, e = 0; ele = $scope.coatings[e]; e++) {
          ele.newPrice = null;
          ele.icon = ($rootScope.currencies.findById(ele.currency) || {}).code;
          ele.fullname = ele.name;
          $scope.prices.push(ele);
        }
        for (var ele, e = 0; ele = $scope.elementFeatures[e]; e++) {
          ele.newPrice = null;
          ele.icon = ($rootScope.currencies.findById(ele.currency) || {}).code;
          ele.fullname = ele.name;
          $scope.prices.push(ele);
        }

        var eles = JSON.parse($scope.item.prices);
        //format is: _id: newPrice
        for (var ele, e = 0; ele = eles[e]; e++) {
          var id = $scope.prices.findIndexById(ele.id);
          if (id < 0) continue;
          $scope.prices[id].newPrice = ele.newPrice;
        }

      }


      $scope.parsePricesToDb = function () {

        if (!$scope.item || !$scope.item.prices || !$scope.prices) return;

        var eles = [];
        for (var ele, e = 0; ele = $scope.prices[e]; e++) {
          if (ele.newPrice) {
            eles.push({
              id: ele._id, newPrice: ele.newPrice
            });
          }
        }

        $scope.item.prices = JSON.stringify(eles);

        return $scope.item.prices;

      }
      $scope.getOrderElements = function () {

        if (!$scope.models || !$scope.models.length) return;

        var elements = {};
        for (var model, i = 0; model = $scope.models[i]; i++) {
          var eles = JSON.parse(model.elements);
          for (var ele, j = 0; ele = eles[j]; j++) {
            if (!elements[ele.id]) elements[ele.id] = 0;
            elements[ele.id] += 1;
          }
        }

        $scope.elements = [];
        for (var e in elements) {
          Elements.query({'id': e}, function (_element) {
            $scope.elements.push(_element);

            if (($scope.elements.length == eles.length)) {
              $scope.calcOrderCost();
            }

          });
        }
      }

      $scope.updateOrderQuantities = function () {

        $scope.totalWorkTime = 0;

        var elements = {};
        for (var model, i = 0; model = $scope.models[i]; i++) {
          $scope.totalWorkTime += model.amount * (model.requiredTime || 0);
          var eles = JSON.parse(model.elements);
          for (var ele, j = 0; ele = eles[j]; j++) {
            if (!elements[ele.id]) elements[ele.id] = 0;
            elements[ele.id] += (model.amount * ele.amount);
          }
        }

        for (var e in elements) {
          //var amount = elements[e]; //not needed
          var ele = $scope.elements.findIndexById(e);
          if (ele >= 0) {
            $scope.elements[ele].amount = (elements[e] || 0);
          }
        }
      }

      $scope.calcOrderCost = function () {

        if (!$scope.elements || !$scope.elements.length > 0) {
          return
        }

        $scope.updateOrderQuantities();
        return $scope.elementsCost({requiredTime: $scope.totalWorkTime}, $scope.elements, $scope.prices);

      }

      $scope.calcOrderWeight = function () {

        if (!$scope.elements || !$scope.elements.length > 0) return;

        return $scope.elementsWeight($scope.elements);

      }


    }]);

'use strict';

angular.module('adminApp')
  .controller('ModelsCtrl', ['$scope', '$rootScope', '$routeParams', '$location', '$timeout', 'Elements', 'Models', 'Orders',
    function ($scope, $rootScope, $routeParams, $location, $timeout, Elements, Models, Orders) {

      $rootScope.init();

      $scope.reloadItem = function (item) {
        $rootScope.anyDbloading = true;
        $rootScope.reloadItemImp($scope, Models, item, function () {
          $scope.parseElementsFromDb();
          $scope.parsePricesFromDb();
          $scope.setmodelId();
          $scope.updateBreadcrumbs('דגמים', 'models', $scope.item);
          $rootScope.anyDbloading = false;
          console.log('Item loaded', $scope.item);
        });
      }
      $scope.updateItem = function (item, asIs) {
        if (!asIs) {
          item = $scope.setItemVars(item);
          $scope.getElementsString();
        }
        $rootScope.updateItemImp($scope, Models, item);
      }
      $scope.removeItem = function (item) {
        $rootScope.removeItemImp($scope, Models, item, function () {
          $location.path('/models');
        });
      }
      $scope.addItem = function (item) {
        $rootScope.addItemImp($scope, Models, null, function (item) {
          $location.path('/models/' + item._id);
        });
      }

      $scope.deleteUnnamedItems = function () {
        $scope.openModal('confirmDeleteUnnamed', function () {
          if (confirm('האם אתה בטוח שברצונך למחוק את הפריטים (זהירות בבקשה)?')) {
            var items = angular.copy($scope.items);
            for (var item, i = 0; item = items[i]; i++) {
              if (!item.name) {
                $scope.items.splice(i, 1);
                Models.remove({id: item._id});
              }
            }
          }
        });
      }

      $scope.duplicateItem = function (item) {
        item = $scope.setItemVars(item);
        $rootScope.tempItem = item;
        $rootScope.addItemImp($scope, Models, null, function (item) {
          $location.path('/models/' + item._id);
        });
      }


      //piece of code for item duplication
      if ($rootScope.tempItem) {
        $scope.item = $rootScope.tempItem;
        $scope.item['_id'] = $routeParams['id'];

        $rootScope.tempItem = null;
        $timeout(function () {
          $scope.updateItem($scope.item, true);
          $scope.parseElementsFromDb();
          $scope.parsePricesFromDb();
          $scope.setmodelId();
        })
      } else {
        $scope.reloadItem({_id: $routeParams['id']});
      }

      var addId = $location.search()['addId'];

      //when this page is opened to choose and element to add to a model
      $scope.addTo = $location.search()['addTo'];


      $rootScope.filter = {};

      $scope.setItemVars = function (item) {
        item.name = ($scope.item.modelType || "") + ($scope.item.modelId || "");
        item.elements = $scope.parseElementsToDb();
        item.prices = $scope.parsePricesToDb();
        return item;
      }

      $scope.setmodelId = function () {
        //get the next recommended id
        if (!$scope.item) return;
        if (!$scope.item.modelType || $scope.item.modelId) {
          $scope.item.recModelId = '0';
          return;
        }

        if ($routeParams['id'] && !$scope.item.modelId) {
          Models.maxId($scope.item, function (item) {
            $scope.item.recModelId = parseInt(Number(item.modelId.replace(/^\D+/g, ''))) + 1;
          });
        }
      }

      $scope.removeElement = function (element) {
        console.log('deleting', element);
        if ($scope.elements && $scope.elements.length > 0) {
          var i = $scope.elements.findIndexById(element._id);
          $scope.elements.splice(i, 1);
        }

        $scope.updateItem($scope.item);
      }

      $scope.zeroElement = function (element) {
        if ($scope.elements && $scope.elements.length > 0) {
          var i = $scope.elements.findIndexById(element._id);
          $scope.elements[i].amount = 0;
        }

        $scope.updateItem($scope.item);
      }

      Orders.all(function (orders) {
        $scope.orders = [];
        for (var order, i = 0; order = orders[i]; i++) {
          if (!order.models) continue;
          var _order = {
            name: order.name || order.desc,
          }
          var id = parseOrderModels(order.models);
          id.unshift(order._id);
          _order._id = JSON.stringify(id);

          $scope.orders.push(_order);
        }
        function parseOrderModels(models) {
          var eles = JSON.parse(models);
          var res = [];
          for (var ele, e = 0; ele = eles[e]; e++) {
            res.push(ele['id']);
          }
          return res
        }
      });

      $scope.$watch('item.modelType', function (newVal, oldVal) {
        if (newVal && (oldVal != newVal)) {
          $scope.setmodelId();
        }
      });

      $scope.moveItem = function (ele, dir) {
        var ele1;
        if (dir > 0) ele1 = $scope.elements.findNextById(ele.pos, 'pos');
        else if (dir < 0) ele1 = $scope.elements.findPrevById(ele.pos, 'pos');


        if (ele && ele1 && ele1.pos >= 0) {
          var tmp = ele.pos;
          ele.pos = ele1.pos;
          ele1.pos = tmp;
        }

        $scope.updateItem($scope.item);

      }

      $scope.parseElementsFromDb = function () {

        if (!$scope.item) return;
        if (!$scope.item.elements) $scope.item.elements = "[]";

        var eles = JSON.parse($scope.item.elements);

        if (addId) {
          var ele = eles.findIndexById(addId, 'id');
          if ((ele >= 0) && eles[ele]) {
            eles[ele].amount += 1;
          } else {
            eles.push({
              id: addId, amount: 1, pos: eles.length
            });
          }
        }

        $scope.elements = [];
        for (var ele, e = 0; ele = eles[e]; e++) {
          Elements.query({'id': ele['id']}, function (_element) {
            _element.amount = eles.findById(_element._id, 'id').amount || 0;
            _element.pos = eles.findById(_element._id, 'id').pos || 0;
            $scope.elements.push(_element);

            if (addId && ($scope.elements.length == eles.length)) {
              $scope.updateItem($scope.item);
              addId = false;
              $location.search({'addId': null});
            }

            if (($scope.elements.length == eles.length)) {
              $scope.calcModelCost();
            }

          });
        }


      }


      $scope.parseElementsToDb = function () {

        if (!$scope.item || !$scope.item.elements || !$scope.elements) return;

        //fix position if needed
        var poss = [];
        var min_pos = 99999999;
        for (var ele, e = 0; ele = $scope.elements[e]; e++) {
          if (!(ele.pos >= 0)) ele.pos = 0;
          while (poss[ele.pos]) {//this position already exist
            ele.pos++;
          }
          if (ele.pos < min_pos) min_pos = ele.pos;
          poss[ele.pos] = true;
        }

        var eles = [];
        for (var ele, e = 0; ele = $scope.elements[e]; e++) {
          eles.push({
            id: ele._id, amount: ele.amount, pos: (ele.pos - min_pos)
          });
        }

        $scope.item.elements = JSON.stringify(eles);

        return $scope.item.elements;

      }

      $scope.getElementsString = function () {
        var arr = [];
        for (var ele, e = 0; ele = $scope.elements[e]; e++) {
          arr.push(ele.name);
        }
        $scope.item.elementsStr = arr.join(', ');
      }

      $scope.parsePricesFromDb = function () {

        if (!$scope.item) return;
        if (!$scope.item.prices) $scope.item.prices = "[]";

        $scope.prices = [];
        $scope.pricesByName = {};
        for (var ele, e = 0; ele = $scope.currencies[e]; e++) {
          if (ele.code == 'ILS') continue; //ignore shekels
          ele.newPrice = null;
          ele.icon = 'ils';
          ele.fullname = ele.name;
          $scope.prices.push(ele);
        }
        for (var ele, e = 0; ele = $scope.materials[e]; e++) {
          ele.newPrice = null;
          ele.icon = ($rootScope.currencies.findById(ele.currency) || {}).code;
          ele.fullname = ele.name + ' (' + ($rootScope.weightUnits.findById(ele.weightUnit._id || ele.weightUnit) || {}).name + ')';
          $scope.prices.push(ele);
        }
        for (var ele, e = 0; ele = $scope.coatings[e]; e++) {
          ele.newPrice = null;
          ele.icon = ($rootScope.currencies.findById(ele.currency) || {}).code;
          ele.fullname = ele.name;
          $scope.prices.push(ele);
        }
        for (var ele, e = 0; ele = $scope.elementFeatures[e]; e++) {
          ele.newPrice = null;
          ele.icon = ($rootScope.currencies.findById(ele.currency) || {}).code;
          ele.fullname = ele.name;
          $scope.prices.push(ele);
        }

        var eles = JSON.parse($scope.item.prices);
        //format is: _id: newPrice
        for (var ele, e = 0; ele = eles[e]; e++) {
          var id = $scope.prices.findIndexById(ele.id);
          if (id < 0) continue;
          $scope.prices[id].newPrice = ele.newPrice;
        }

        for (var price, e = 0; price = $scope.prices[e]; e++) {
          $scope.pricesByName[price.name] = price.newPrice || price.price;
        }

      }


      $scope.parsePricesToDb = function () {

        if (!$scope.item || !$scope.item.prices || !$scope.prices) return;

        var eles = [];
        for (var ele, e = 0; ele = $scope.prices[e]; e++) {
          if (ele.newPrice) {
            eles.push({
              id: ele._id, newPrice: ele.newPrice
            });
          }
        }

        $scope.item.prices = JSON.stringify(eles);

        return $scope.item.prices;

      }

      $scope.calcModelCost = function () {

        if (!$scope.elements || !$scope.elements.length) return;

        var cost = $scope.elementsCost($scope.item, $scope.elements, $scope.prices);

        $scope.costs = {};
        for (var c, i = 0; c = $rootScope.currenciesWithOverride[i]; i++) {
          $scope.costs[c.code] = cost / c.conversion;
        }

        $scope.item.costs = JSON.stringify($scope.costs);
        $scope.item.eTypesCosts = JSON.stringify($scope.item.eTypesCosts);

        return cost;

      }

      $scope.calcModelWeight = function () {

        if (!$scope.elements || !$scope.elements.length) return;

        var totalWeight = $scope.elementsWeight($scope.elements);

        $scope.weights = {
          total: totalWeight
        }
        var metal = '';
        var metals = [];
        for (var i in $rootScope.materialsWeight) {
          metal = $rootScope.materials.findById(i).name;
          if (!metal) continue;
          $scope.weights[metal] = $rootScope.materialsWeight[i];
          if (metals.indexOf(metal) == -1) metals.push(metal);
        }

        var stones = [];
        var stonesCost = 0;
        var stone = '';
        var patt = new RegExp(/(אבן|אבנים)/);

        for (var ele, e = 0; ele = $scope.elements[e]; e++) {
          stone = $rootScope.elementTypes.findById(ele.elementType._id || ele.elementType).name;
          if (!stone) continue;
          if (patt.test(stone)) {
            if (stones.indexOf(ele.name) == -1) stones.push(ele.name);
            stonesCost += ele.cost;
          }
        }

        $scope.item.metals = metals.join(', ');
        $scope.item.stones = stones.join(', ');
        $scope.item.weights = JSON.stringify($scope.weights);

        return totalWeight;

      }

    }]);

'use strict';

angular.module('adminApp')
  .controller('ElementsCtrl', ['$scope', '$rootScope', '$routeParams', '$location', '$timeout', 'Models', 'Elements',
    function ($scope, $rootScope, $routeParams, $location, $timeout, Models, Elements) {

      $rootScope.init();

      $scope.reloadItem = function (item) {
        $rootScope.anyDbloading = true;
        $rootScope.reloadItemImp($scope, Elements, item, function () {
          $scope.updateBreadcrumbs('אלמנטים', 'elements', $scope.item);
          $scope.setUnitsNames();
          $rootScope.anyDbloading = false;
        });
      }
      $scope.updateItem = function (item) {
        $rootScope.updateItemImp($scope, Elements, item, function () {
          $scope.setUnitsNames();
        });
      }
      $scope.removeItem = function (item) {
        $rootScope.removeItemImp($scope, Elements, item, function () {
          $location.path('/elements');
        });
      }
      $scope.addItem = function (item) {
        $rootScope.addItemImp($scope, Elements, null, function (item) {
          $location.path('/elements/' + item._id);
        });
      }
      $scope.deleteUnnamedItems = function () {
        $scope.openModal('confirmDeleteUnnamed', function () {
          if (confirm('האם אתה בטוח שברצונך למחוק את הפריטים (זהירות בבקשה)?')) {
            var items = angular.copy($scope.items);
            for (var item, i = 0; item = items[i]; i++) {
              if (!item.name) {
                $scope.items.splice(i, 1);
                Elements.remove({id: item._id});
              }
            }
          }
        });
      }

      $scope.duplicateItem = function (item) {
        $rootScope.tempItem = item;
        $rootScope.addItemImp($scope, Elements, null, function (item) {
          $location.path('/elements/' + item._id);
        });
      }

      //piece of code for item duplication
      if ($rootScope.tempItem) {
        $timeout(function () {
          $scope.item = $rootScope.tempItem;
          $scope.item['_id'] = $routeParams['id'];

          $rootScope.tempItem = null;
          $timeout(function () {
            $scope.updateItem($scope.item);
          })
        })
      } else {
        $scope.reloadItem({_id: $routeParams['id']});
      }

      //when this page is opened to choose and element to add to a model
      $scope.addTo = $location.search()['addTo'];

      $rootScope.filter = {};

      if (!$routeParams['id']) {
        //only fetch models on elements screen (used for filtering)
        Models.all(function (models) {
          $scope.models = [];
          for (var model, i = 0; model = models[i]; i++) {
            if (!model.elements) continue;
            var _model = {
              name: model.modelCode || model.desc
            }
            var id = parseModelElements(model.elements);
            id.unshift(model._id);
            _model._id = JSON.stringify(id);

            $scope.models.push(_model);
          }
          function parseModelElements(elements) {
            var eles = JSON.parse(elements);
            var res = [];
            for (var ele, e = 0; ele = eles[e]; e++) {
              res.push(ele['id']);
            }
            return res
          }
        });
      }

      $scope.$on('measureUnitsChanged', function () {
        $scope.setUnitsNames();
      });

      $scope.measureUnitName = $scope.measureUnitOldName = 'יחידת מדידה';
      $scope.workUnitName = $scope.workUnitOldName = 'יחידת עבודה';
      $scope.setUnitsNames = function () {
        if (!$scope.item) return;
        $timeout(function () {
          var labels = $('label.control-label');
          var inputs = $('.form-control');

          $scope.measureUnitOldName = $scope.measureUnitName;
          $scope.workUnitOldName = $scope.workUnitName;

          if ($scope.item.elementType && $scope.item.elementType.measureUnit) {
            if (angular.isObject($scope.item.elementType.measureUnit)) {
              $scope.measureUnitName = $rootScope.measureUnits.findById($scope.item.elementType.measureUnit._id).name;
            } else {
              $scope.measureUnitName = $rootScope.measureUnits.findById($scope.item.elementType.measureUnit).name;
            }
          }
          if ($scope.item.workUnit && $scope.item.workUnit._id) {
            if (angular.isObject($scope.item.workUnit)) {
              $scope.workUnitName = $rootScope.measureUnits.findById($scope.item.workUnit._id).name;
            } else {
              $scope.workUnitName = $rootScope.measureUnits.findById($scope.item.workUnit).name;
            }
          }
          labels.each(function (i) {
            var label = labels[i];
            if ($(label).text()) {
              $(label).text($(label).text().replace($scope.workUnitOldName, $scope.workUnitName));
              $(label).text($(label).text().replace($scope.measureUnitOldName, $scope.measureUnitName));
            }
            if ($(label).attr('title')) {
              $(label).attr('title', $(label).attr('title').replace($scope.workUnitOldName, $scope.workUnitName));
              $(label).attr('title', $(label).attr('title').replace($scope.measureUnitOldName, $scope.measureUnitName));
            }
          });
          inputs.each(function (i) {
            var input = inputs[i];
            if ($(input).attr('placeholder')) {
              $(input).attr('placeholder', $(input).attr('placeholder').replace($scope.workUnitOldName, $scope.workUnitName));
              $(input).attr('placeholder', $(input).attr('placeholder').replace($scope.measureUnitOldName, $scope.measureUnitName));
            }
          });
        }, 100)
      }

      //duplicate items to reach 100000 (for testing)
      $scope.duplicateForTest = function () {
        var limit = 100000;
        while ($scope.items.length < limit) {
          $scope.items = $scope.items.concat($scope.items);
        }
      };

      $scope.calcElementCost = function () {

        if (!$scope.item) return;

        var item = $scope.item;
        item.amount = 1;
        return $scope.elementsCost({requiredTime: 0}, [item], []);

      }

    }])
;

'use strict';

angular.module('adminApp')
  .controller('CoatingsCtrl', ['$scope', '$rootScope', '$routeParams', '$location', '$timeout', 'Coatings',
    function ($scope, $rootScope, $routeParams, $location, $timeout, Coatings) {

      $scope.reloadItem = function (item) {
        $rootScope.reloadItemImp($scope, Coatings, item, function(){
          $scope.updateBreadcrumbs('ציפויים', 'coatings', $scope.item);
        });
      }
      $scope.updateItem = function (item) {
        $rootScope.updateItemImp($scope, Coatings, item, function(){
          $rootScope.init();
        });
      }
      $scope.removeItem = function (item) {
        $rootScope.removeItemImp($scope, Coatings, item, function(){
          $location.path('/coatings');
        });
      }
      $scope.addItem = function (item) {
        $rootScope.addItemImp($scope, Coatings, null, function (item) {
          $location.path('/coatings/' + item._id);
        });
      }

      $scope.duplicateItem = function (item) {
        $rootScope.tempItem = item;
        $rootScope.addItemImp($scope, Coatings, null, function (item) {
          $location.path('/coatings/' + item._id);
        });
      }

      $scope.moveItemDown = function(item){
        $rootScope.moveItemImp($scope, Coatings, $scope.items, item, 1)
      }
      $scope.moveItemUp = function(item){
        $rootScope.moveItemImp($scope, Coatings, $scope.items, item, -1)
      }


      //piece of code for item duplication
      if ($rootScope.tempItem) {
        $timeout(function () {
          $scope.item = $rootScope.tempItem;
          $scope.item['_id'] = $routeParams['id'];

          $rootScope.tempItem = null;
          $timeout(function () {
            $scope.updateItem($scope.item);
          })
        })
      } else {
        $scope.reloadItem({_id: $routeParams['id']});
      }

    }]);

'use strict';

angular.module('adminApp')
  .controller('MaterialsCtrl', ['$scope', '$rootScope', '$routeParams', '$location', '$timeout', 'Materials',
    function ($scope, $rootScope, $routeParams, $location, $timeout, Materials) {

      $scope.reloadItem = function (item) {
        $rootScope.reloadItemImp($scope, Materials, item, function(){
          $scope.updateBreadcrumbs('חומרים', 'materials', $scope.item);
        });
      }
      $scope.updateItem = function (item) {
        $rootScope.updateItemImp($scope, Materials, item, function(){
          $rootScope.init();
        });
      }
      $scope.removeItem = function (item) {
        $rootScope.removeItemImp($scope, Materials, item, function(){
          $location.path('/materials');
        });
      }
      $scope.addItem = function (item) {
        $rootScope.addItemImp($scope, Materials, null, function (item) {
          $location.path('/materials/' + item._id);
        });
      }

      $scope.duplicateItem = function (item) {
        $rootScope.tempItem = item;
        $rootScope.addItemImp($scope, Materials, null, function (item) {
          $location.path('/materials/' + item._id);
        });
      }

      $scope.moveItemDown = function(item){
        $rootScope.moveItemImp($scope, Materials, $scope.items, item, 1)
      }
      $scope.moveItemUp = function(item){
        $rootScope.moveItemImp($scope, Materials, $scope.items, item, -1)
      }


      //piece of code for item duplication
      if ($rootScope.tempItem) {
        $timeout(function () {
          $scope.item = $rootScope.tempItem;
          $scope.item['_id'] = $routeParams['id'];

          $rootScope.tempItem = null;
          $timeout(function () {
            $scope.updateItem($scope.item);
          })
        })
      } else {
        $scope.reloadItem({_id: $routeParams['id']});
      }

    }]);

'use strict';

angular.module('adminApp')
  .controller('ProvidersCtrl', ['$scope', '$rootScope', '$routeParams', '$location', '$timeout', 'Providers',
    function ($scope, $rootScope, $routeParams, $location, $timeout, Providers) {

      $scope.reloadItem = function (item) {
        $rootScope.reloadItemImp($scope, Providers, item, function(){
          $scope.updateBreadcrumbs('ספקים', 'providers', $scope.item);
        });
      }
      $scope.updateItem = function (item) {
        $rootScope.updateItemImp($scope, Providers, item, function(){
          $rootScope.init();
        });
      }
      $scope.removeItem = function (item) {
        $rootScope.removeItemImp($scope, Providers, item, function(){
          $location.path('/providers');
        });
      }
      $scope.addItem = function (item) {
        $rootScope.addItemImp($scope, Providers, null, function (item) {
          $location.path('/providers/' + item._id);
        });
      }

      $scope.duplicateItem = function (item) {
        $rootScope.tempItem = item;
        $rootScope.addItemImp($scope, Providers, null, function (item) {
          $location.path('/providers/' + item._id);
        });
      }

      $scope.moveItemDown = function(item){
        $rootScope.moveItemImp($scope, Providers, $scope.items, item, 1)
      }
      $scope.moveItemUp = function(item){
        $rootScope.moveItemImp($scope, Providers, $scope.items, item, -1)
      }


      //piece of code for item duplication
      if ($rootScope.tempItem) {
        $timeout(function () {
          $scope.item = $rootScope.tempItem;
          $scope.item['_id'] = $routeParams['id'];

          $rootScope.tempItem = null;
          $timeout(function () {
            $scope.updateItem($scope.item);
          })
        })
      } else {
        $scope.reloadItem({_id: $routeParams['id']});
      }

    }]);

'use strict';

angular.module('adminApp')
  .controller('ElementFeaturesCtrl', ['$scope', '$rootScope', '$routeParams', '$location', '$timeout', 'ElementFeatures',
    function ($scope, $rootScope, $routeParams, $location, $timeout, ElementFeatures) {

      $scope.reloadItem = function (item) {
        $rootScope.reloadItemImp($scope, ElementFeatures, item, function(){
          $scope.updateBreadcrumbs('תכונות נוספות', 'elementFeatures', $scope.item);
        });
      }
      $scope.updateItem = function (item) {
        $rootScope.updateItemImp($scope, ElementFeatures, item, function(){
          $rootScope.init();
        });
      }
      $scope.removeItem = function (item) {
        $rootScope.removeItemImp($scope, ElementFeatures, item, function(){
          $location.path('/elementFeatures');
        });
      }
      $scope.addItem = function (item) {
        $rootScope.addItemImp($scope, ElementFeatures, null, function (item) {
          $location.path('/elementFeatures/' + item._id);
        });
      }

      $scope.duplicateItem = function (item) {
        $rootScope.tempItem = item;
        $rootScope.addItemImp($scope, ElementFeatures, null, function (item) {
          $location.path('/elementFeatures/' + item._id);
        });
      }

      $scope.moveItemDown = function(item){
        $rootScope.moveItemImp($scope, ElementFeatures, $scope.items, item, 1)
      }
      $scope.moveItemUp = function(item){
        $rootScope.moveItemImp($scope, ElementFeatures, $scope.items, item, -1)
      }


      //piece of code for item duplication
      if ($rootScope.tempItem) {
        $timeout(function () {
          $scope.item = $rootScope.tempItem;
          $scope.item['_id'] = $routeParams['id'];

          $rootScope.tempItem = null;
          $timeout(function () {
            $scope.updateItem($scope.item);
          })
        })
      } else {
        $scope.reloadItem({_id: $routeParams['id']});
      }

    }]);

'use strict';

angular.module('adminApp')
  .controller('ElementTypesCtrl', ['$scope', '$rootScope', '$routeParams', '$location', '$timeout', 'ElementTypes',
    function ($scope, $rootScope, $routeParams, $location, $timeout, ElementTypes) {

      $scope.reloadItem = function (item) {
        $rootScope.reloadItemImp($scope, ElementTypes, item, function(){
          $scope.updateBreadcrumbs('סוגי אלמנטים', 'elementTypes', $scope.item);
        });
      }
      $scope.updateItem = function (item) {
        $rootScope.updateItemImp($scope, ElementTypes, item, function(){
          $rootScope.init();
        });
      }
      $scope.removeItem = function (item) {
        $rootScope.removeItemImp($scope, ElementTypes, item, function(){
          $location.path('/elementTypes');
        });
      }
      $scope.addItem = function (item) {
        $rootScope.addItemImp($scope, ElementTypes, null, function (item) {
          $location.path('/elementTypes/' + item._id);
        });
      }

      $scope.duplicateItem = function (item) {
        $rootScope.tempItem = item;
        $rootScope.addItemImp($scope, ElementTypes, null, function (item) {
          $location.path('/elementTypes/' + item._id);
        });
      }

      $scope.moveItemDown = function(item){
        $rootScope.moveItemImp($scope, ElementTypes, $scope.items, item, 1)
      }
      $scope.moveItemUp = function(item){
        $rootScope.moveItemImp($scope, ElementTypes, $scope.items, item, -1)
      }


      //piece of code for item duplication
      if ($rootScope.tempItem) {
        $timeout(function () {
          $scope.item = $rootScope.tempItem;
          $scope.item['_id'] = $routeParams['id'];

          $rootScope.tempItem = null;
          $timeout(function () {
            $scope.updateItem($scope.item);
          })
        })
      } else {
        $scope.reloadItem({_id: $routeParams['id']});
      }

    }]);

angular.module('adminApp')
  .controller('ExportCtrl', function ($scope) {
    $scope.tableToExcel = (function () {
      var uri = 'data:application/vnd.ms-excel;base64,'
        , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
        , base64 = function (s) {
          return window.btoa(unescape(encodeURIComponent(s)))
        }
        , format = function (s, c) {
          return s.replace(/{(\w+)}/g, function (m, p) {
            return c[p];
          })
        }
      return function (table, name, filename) {
        if (!table.nodeType) table = document.getElementById(table)
        var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML}

        document.getElementById("dlink").href = uri + base64(format(template, ctx));
        document.getElementById("dlink").download = filename;
        document.getElementById("dlink").click();

      }
    })()
  });

'use strict';

/* Controllers */

$.cloudinary.config().cloud_name = 'turkenich';
$.cloudinary.config().upload_preset = 'hozspifg';


var photoAlbumControllers = angular.module('adminApp');

photoAlbumControllers.controller('photoUploadCtrlJQuery', ['$scope', '$rootScope', '$routeParams', '$location',
  /* Uploading with jQuery File Upload */
  function($scope, $rootScope, $routeParams, $location) {
    $scope.files = {};
    $scope.updateTitle = function(){
      var uploadParams = $scope.widget.fileupload('option', 'formData');
      uploadParams["context"] = "photo=" + $scope.title;
      $scope.widget.fileupload('option', 'formData', uploadParams);
    };

    $scope.widget = $(".cloudinary_fileupload")
      .unsigned_cloudinary_upload($.cloudinary.config().upload_preset, {tags: 'myphotoalbum', context:'photo='}, {
        // Uncomment the following lines to enable client side image resizing and valiation.
        // Make sure cloudinary/processing is included the js file
        //disableImageResize: false,
        //imageMaxWidth: 800,
        //imageMaxHeight: 600,
        //acceptFileTypes: /(\.|\/)(gif|jpe?g|png|bmp|ico)$/i,
        //maxFileSize: 20000000, // 20MB
        dropZone: "#direct_upload_jquery",
        start: function (e) {
          $scope.status = "Starting upload...";
          $scope.files = {};
          $scope.$apply();
        },
        fail: function (e, data) {
          $scope.status = "Upload failed";
          $scope.$apply();
        }
      })
      .on("cloudinaryprogress", function (e, data) {
        var name = data.files[0].name;
        var file = $scope.files[name] || {};
        file.progress = Math.round((data.loaded * 100.0) / data.total);
        file.status = "Uploading... " + file.progress + "%";
        $scope.files[name] = file;
        $scope.$apply();
        })
      .on("cloudinaryprogressall", function (e, data) {
        $scope.progress = Math.round((data.loaded * 100.0) / data.total);
        $scope.status = "Uploading... " + $scope.progress + "%";
        $scope.$apply();
      })
      .on("cloudinarydone", function (e, data) {
        $rootScope.photos = $rootScope.photos || [];
        data.result.context = {custom: {photo: $scope.title}};
        $scope.result = data.result;
        var name = data.files[0].name;
        var file = $scope.files[name] ||{};
        file.name = name;
        file.result = data.result;
        $scope.files[name] = file;
        $rootScope.photos.push(data.result);
        $scope.$apply();
      });
  }]).controller('photoUploadCtrl', ['$scope', '$rootScope', '$routeParams', '$location', '$upload',
  /* Uploading with Angular File Upload */
  function($scope, $rootScope, $routeParams, $location, $upload) {

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

      return new Blob([ia], {type:mimeString});
    }
    $scope.$watch('camera', function(dataURI) {

      if (!dataURI) return;

      var file = dataURItoBlob(dataURI);

      $scope.upload = $upload.upload({
        url: "https://api.cloudinary.com/v1_1/" + $.cloudinary.config().cloud_name + "/upload",
        data: {
          upload_preset: $.cloudinary.config().upload_preset,
          tags: 'myphotoalbum',
          context:'photo=' + $scope.title
        },
        file: file
      }).progress(function (e) {
        file.progress = Math.round((e.loaded * 100.0) / e.total);
        file.status = "Uploading... " + file.progress + "%";
        if(!$scope.$$phase) {
          $scope.$apply();
        }
      }).success(function (data, status, headers, config) {
        $rootScope.photos = $rootScope.photos || [];
        data.context = {custom: {photo: $scope.title}};
        file.result = data;
        $rootScope.photos.push(data);
        if(!$scope.$$phase) {
          $scope.$apply();
        }
      });
    });

    $scope.$watch('files', function() {
      if (!$scope.files) return;
      $scope.files.forEach(function(file){
        $scope.upload = $upload.upload({
          url: "https://api.cloudinary.com/v1_1/" + $.cloudinary.config().cloud_name + "/upload",
          data: {upload_preset: $.cloudinary.config().upload_preset, tags: 'myphotoalbum', context:'photo=' + $scope.title},
          file: file
        }).progress(function (e) {
          file.progress = Math.round((e.loaded * 100.0) / e.total);
          file.status = "Uploading... " + file.progress + "%";
          if(!$scope.$$phase) {
            $scope.$apply();
          }
        }).success(function (data, status, headers, config) {
          $rootScope.photos = $rootScope.photos || [];
          data.context = {custom: {photo: $scope.title}};
          file.result = data;
          $rootScope.photos.push(data);
          if(!$scope.$$phase) {
            $scope.$apply();
          }
        });
      });
    });

    /* Modify the look and fill of the dropzone when files are being dragged over it */
    $scope.dragOverClass = function($event) {
      var items = $event.dataTransfer.items;
      var hasFile = false;
      if (items != null) {
        for (var i = 0 ; i < items.length; i++) {
          if (items[i].kind == 'file') {
            hasFile = true;
            break;
          }
        }
      } else {
        hasFile = true;
      }
      return hasFile ? "dragover" : "dragover-err";
    };
  }]);

'use strict';

angular.module('adminApp')
    .factory('Prices', ['$resource', function ($resource) {
        return $resource(Consts.api_root + 'prices/:id', {}, {
            all: { withCredentials: true, method: 'GET', params: {}, isArray: true },
            query: { withCredentials: true, method: 'GET', params: {}, isArray: false },
            create: { withCredentials: true, method: 'POST', params: {} },
            update: { withCredentials: true, method: 'PUT', params: {id: '@_id'} },
            remove: { withCredentials: true, method: 'DELETE', params: {id: '@_id'} }
        });
    }]);

'use strict';

angular.module('adminApp')
    .factory('Settings', ['$resource', function ($resource) {
        return $resource(Consts.api_root + 'settings/:id', {}, {
            all: { method: 'GET', params: {}, isArray: true },
            query: { method: 'GET', params: {}, isArray: false },
            create: { method: 'POST', params: {} },
            update: { method: 'PUT', params: {id: '@_id'} },
            remove: { method: 'DELETE', params: {id: '@_id'} }
        });
    }]);

'use strict';

angular.module('adminApp')
    .factory('Orders', ['$resource', function ($resource) {
        return $resource(Consts.api_root + 'orders/:id', {}, {
            all: { method: 'GET', params: {}, isArray: true },
            query: { method: 'GET', params: {}, isArray: false },
            create: { method: 'POST', params: {} },
            update: { method: 'PUT', params: {id: '@_id'} },
            remove: { method: 'DELETE', params: {id: '@_id'} }
        });
    }]);

'use strict';

angular.module('adminApp')
  .factory('Models', ['$resource', function ($resource) {
    return $resource(Consts.api_root + 'models/:id', {}, {
      all: {method: 'GET', params: {}, isArray: true},
      query: {method: 'GET', params: {}, isArray: false},
      maxId: {method: 'GET', params: {id: 'maxId'}, isArray: false},
      create: {method: 'POST', params: {}},
      update: {method: 'PUT', params: {id: '@_id'}},
      remove: {method: 'DELETE', params: {id: '@_id'}}
    });
  }]);

'use strict';

angular.module('adminApp')
    .factory('Elements', ['$resource', function ($resource) {
        return $resource(Consts.api_root + 'elements/:id', {}, {
            all: { method: 'GET', params: {}, isArray: true },
            query: { method: 'GET', params: {}, isArray: false },
            create: { method: 'POST', params: {} },
            update: { method: 'PUT', params: {id: '@_id'} },
            remove: { method: 'DELETE', params: {id: '@_id'} }
        });
    }]);

'use strict';

angular.module('adminApp')
    .factory('ElementTypes', ['$resource', function ($resource) {
        return $resource(Consts.api_root + 'elementTypes/:id', {}, {
            all: { method: 'GET', params: {}, isArray: true },
            query: { method: 'GET', params: {}, isArray: false },
            create: { method: 'POST', params: {} },
            update: { method: 'PUT', params: {id: '@_id'} },
            remove: { method: 'DELETE', params: {id: '@_id'} }
        });
    }]);

'use strict';

angular.module('adminApp')
    .factory('Materials', ['$resource', function ($resource) {
        return $resource(Consts.api_root + 'materials/:id', {}, {
            all: { method: 'GET', params: {}, isArray: true },
            query: { method: 'GET', params: {}, isArray: false },
            create: { method: 'POST', params: {} },
            update: { method: 'PUT', params: {id: '@_id'} },
            remove: { method: 'DELETE', params: {id: '@_id'} }
        });
    }]);

'use strict';

angular.module('adminApp')
    .factory('Coatings', ['$resource', function ($resource) {
        return $resource(Consts.api_root + 'coatings/:id', {}, {
            all: { method: 'GET', params: {}, isArray: true },
            query: { method: 'GET', params: {}, isArray: false },
            create: { method: 'POST', params: {} },
            update: { method: 'PUT', params: {id: '@_id'} },
            remove: { method: 'DELETE', params: {id: '@_id'} }
        });
    }]);

'use strict';

angular.module('adminApp')
    .factory('Providers', ['$resource', function ($resource) {
        return $resource(Consts.api_root + 'providers/:id', {}, {
            all: { method: 'GET', params: {}, isArray: true },
            query: { method: 'GET', params: {}, isArray: false },
            create: { method: 'POST', params: {} },
            update: { method: 'PUT', params: {id: '@_id'} },
            remove: { method: 'DELETE', params: {id: '@_id'} }
        });
    }]);

'use strict';

angular.module('adminApp')
    .factory('ElementFeatures', ['$resource', function ($resource) {
        return $resource(Consts.api_root + 'elementFeatures/:id', {}, {
            all: { method: 'GET', params: {}, isArray: true },
            query: { method: 'GET', params: {}, isArray: false },
            create: { method: 'POST', params: {} },
            update: { method: 'PUT', params: {id: '@_id'} },
            remove: { method: 'DELETE', params: {id: '@_id'} }
        });
    }]);

'use strict';

/**
 * @ngdoc directive
 * @name adminApp.directive:itemActions
 * @description
 * # itemActions
 */
angular.module('adminApp')
  .directive('itemActions', function () {
    return {
      template: '  ' +
      '<div class="btn-group" role="group">' +
      '<button class="btn btn-{{isDirty() ? \'default\' : \'disabled\' }}" ng-click="updateItem(item);"><i class="fa fa-fw fa-save"></i> שמירה</button>' +
      '<button class="btn btn-{{isDirty() ? \'primary\' : \'disabled\' }}" ng-click="setSaving(true); updateItem(item); "><i class="fa fa-fw fa-{{saving ? \'refresh fa-spin\' : \'check\'}}"></i> שמירה וסיום</button>' +
      '<button class="btn btn-{{isDirty() ? \'success\' : \'disabled\' }}" ng-click="cancelChanges(); duplicateItem(item)"><i class="fa fa-fw fa-plus"></i> שמירה כחדש</button>' +
      '<button class="btn btn-{{isDirty() ? \'warning\' : \'disabled\' }}" ng-click="cancelChanges(); goBack(0);"><i class="fa fa-fw fa-undo"></i> ביטול</button>' +
      '<button class="btn btn-danger" ng-click="removeItem(item)"><i class="fa fa-fw fa-trash"></i> מחיקה</button>' +
      '<button class="btn btn-default" ng-click="openModal(\'export\')"><i class="fa fa-fw fa-download"></i> ייצוא</button>' +

      '</div>'+
      '<div style="clear:both;"></div>'
      ,
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        scope.isDirty = function () {
          return ($('.ng-dirty').length > 0);
        }

        scope.cancelChanges = function () {
          ($('.ng-dirty').removeClass('ng-dirty'));
        }

        scope.$on('$locationChangeStart', function (event) {
          if (scope.isDirty()) {
            var answer = confirm("עדיין לא שמרת את הפריט. מעבר העמוד יבטל את השינויים, האם ברצונך להמשיך?")
            if (!answer) {
              event.preventDefault();
            }
          }
        });
      }
    };
  });

'use strict';

/**
 * @ngdoc filter
 * @name adminApp.filter:listFilter
 * @function
 * @description
 * # listFilter
 * Filter in the adminApp.
 */
angular.module('adminApp')
  .filter('listFilter', ['$rootScope', function ($rootScope) {
    return function (input) {
      if (input.length <= 0) return;

      var filter = $rootScope.filter;
      var list = [];
      var limit = 100;

      for (var item, i=0; item=input[i]; i++){
        if (list.length > limit) break;
        if (shouldKeepItem(item, filter)) {
          list.push(item);
        }
      }

      function shouldKeepItem(item, filters){
        for (var field in filters){

          var filter = filters[field];

          if (field.indexOf('_') > 0){
            var f_parts = field.split('_');
            var f = f_parts[0];
            if (f_parts[1]) {var f_type = f_parts[1];}
          }else{
            f = field;
          }

          if (!item[f]) return false;
          if (angular.isArray(filter)){
            if (filter.indexOf(item[f])==-1) return false;
          }
          else if (angular.isDate(filter)){
            var filterDate = new Date(filter);
            var itemDate = new Date(item[f]);
            if (f_type=='below'){
              if (filterDate < itemDate) return false;
            }else if (f_type=='above'){
              if (filterDate > itemDate) return false;
            }else{
              if (filter && filterDate != itemDate) return false;
            }
          }
          else if (angular.isObject(filter)) {
            if (angular.isObject(item[f])){
              if (filter._id != item[f]._id) return false;
            }else{
              if (filter._id != item[f]) return false;
            }
          }
          else if (angular.isNumber(filter)){
            if (f_type=='below'){
              if (filter < item[f]) return false;
            }else if (f_type=='above'){
              if (filter > item[f]) return false;
            }else{
              if (filter && filter != item[f]) return false;
            }
          }
          else if ((typeof(item[f]) == 'string') && (typeof(filter) == 'string')){
            var patt = new RegExp(filter.toLowerCase());
            if (!patt.test(item[f].toLowerCase())) return false;
          }
        }
        return true;
      }

      return list;
    };
  }]);
