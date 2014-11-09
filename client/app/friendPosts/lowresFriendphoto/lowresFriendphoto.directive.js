'use strict';

angular.module('travelPhotosApp')
  .directive('lowresFriendphoto', function () {
    return {
      templateUrl: 'app/friendPosts/lowresFriendphoto/lowresFriendphoto.html',
      restrict: 'E',
      link: function (scope, element, attrs) {
      }
    };
  });