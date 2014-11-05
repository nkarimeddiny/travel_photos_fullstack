'use strict';

angular.module('travelPhotosApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('places', {
        url: '/places',
        templateUrl: 'app/places/places.html',
        controller: 'PlacesCtrl'
      });
  });