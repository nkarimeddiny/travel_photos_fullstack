'use strict';

angular.module('travelPhotosApp')
  .directive('placeToGo', function () {
    return {
      templateUrl: 'app/main/placeToGo/placeToGo.html',
      restrict: 'E',
      link: function (scope, element, attrs) {
      }
    };
  });