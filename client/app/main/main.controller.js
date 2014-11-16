'use strict';


var app = angular.module('travelPhotosApp');
  
  app.controller('MainCtrl', function ($scope, $http, googleMapsService, 
                               googleGeolocationService, placeService) {
    var ctrl = this;

    this.myPlacesList = [];

    placeService.retrievePlaces($http, ctrl, googleMapsService);

    this.removePlace = function(placeId) {
      placeService.removePlace(placeId, $http, ctrl, googleMapsService);
    }

/////////////////////////////////////////////////////////////////////
//For validating and submitting the places-to-go form:
    this.placeInputError = false;
    this.addressInputError = false;

    this.addPlace = function() {
      if (!(placeForm.place.value.trim())) {
         ctrl.placeInputError = true;
      }
      else {
         ctrl.placeInputError = false;
      }
      if (!(placeForm.address.value.trim())) {
         ctrl.addressInputError = true;
      }
      else {
         ctrl.addressInputError = false;
      }
      if (!ctrl.placeInputError && !ctrl.addressInputError) {
        //use address to get geolocation, by ajax,
        // then in callback save the data
        googleGeolocationService.geolocate(placeForm, ctrl, 
          $scope, googleMapsService, $http, placeService);
      }
    }; 
//////////////////////////////////////////////////////////////////// 
  });



