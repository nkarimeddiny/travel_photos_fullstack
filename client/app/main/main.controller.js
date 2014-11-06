'use strict';


var app = angular.module('travelPhotosApp');
  
  app.controller('MainCtrl', function ($scope, $http, googleMapsService, googleGeolocationService, postingService) {
     
    var ctrl = this;

    this.myPlacesList = [];

    postingService.retrievePlaces($http, ctrl, googleMapsService);

    this.removePlace = function(placeId) {
      postingService.removePlace(placeId, $http, ctrl);
    }

/////////////////////////////////////////////////////////////////////
//For validating and submitting the places-to-go form:
    this.placeInputError = false;
    this.addressInputError = false;

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
        googleGeolocationService.geolocate(placeForm, ctrl, 
          $scope, googleMapsService, $http, postingService);
      }
    }; 
//////////////////////////////////////////////////////////////////// 
  });



