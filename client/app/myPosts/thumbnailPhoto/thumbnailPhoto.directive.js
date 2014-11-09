'use strict';

angular.module('travelPhotosApp')
  .directive('thumbnailPhoto', function () {
    return {
      templateUrl: 'app/myPosts/thumbnailPhoto/thumbnailPhoto.html',
      restrict: 'E',
      link: function (scope, element, attrs) {
      }
    };
  });