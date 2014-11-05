'use strict';


var app = angular.module('travelPhotosApp');
  
  app.controller('MainCtrl', function ($scope, $http, googleMapsService, googleGeolocationService, postingService) {
     
    var ctrl = this;

    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    this.myPlacesList = [];

    postingService.retrievePlaces($http, ctrl, googleMapsService);

    //googleMapsService.initialize(ctrl);  

    ctrl.placeInputError = false;
    ctrl.addressInputError = false;

    this.removePlace = function(placeId) {
      postingService.removePlace(placeId, $http, ctrl);
    }

    this.addPlace = function() {
      if (!placeForm.place.value) {
         ctrl.placeInputError = true;
      }
      else {
         ctrl.placeInputError = false;
      }
      if (!placeForm.address.value) {
         ctrl.addressInputError = true;
      }
      else {
         ctrl.addressInputError = false;
      }
      if (!ctrl.placeInputError && !ctrl.addressInputError) {
        //use address to get geolocation, by ajax, then in callback save the data
        googleGeolocationService.geolocate(placeForm.address.value, ctrl, $scope, googleMapsService, $http, postingService);
      }
    }; 
 
  });



