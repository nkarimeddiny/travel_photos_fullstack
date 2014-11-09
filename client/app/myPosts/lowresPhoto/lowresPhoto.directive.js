'use strict';

angular.module('travelPhotosApp')
  .directive('lowresPhoto', function () {
    return {
      templateUrl: 'app/myPosts/lowresPhoto/lowresPhoto.html',
      restrict: 'E',
      link: function (scope, element, attrs) {
      }
    };
  });