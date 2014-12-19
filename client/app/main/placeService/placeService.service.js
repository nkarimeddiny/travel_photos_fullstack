'use strict';

angular.module('travelPhotosApp')
  .factory('placeService', function () {

    return {
      //addPlace method is called by googleGeolocationService and placeService, 
      //and takes a place object, which has info about a place-to-go. It sends the
      //place object to the server, then assigns myPlacesList to the returned
      //data, which is an array of objects for each place-to-go that has been
      //saved by the current user. The googleMapsService.initialize method is
      //then called in order to add markers to the map
        addPlace : function(place, $http, ctrl, 
                     googleMapsService, initializeMap,
                     instagramLink) { 
              //instagramLink is only passed as an argument when a place is added
              //by clicking on button below a friend's post
              $http.post("api/users/place", 
                    {placeObj: place,
                     link: instagramLink
                    }) 
                .success(function(data) {
                  ctrl.myPlacesList = data;
                  if (initializeMap) googleMapsService.initialize(ctrl);
                  ctrl.addedPlace = true;
              })
                .error(function(data) {
                  ctrl.errorOccurred = true;
              })
       },

       //retrievePlaces method is called by main controller, and sends a 
       //request to the server for the current user's saved places-to-go.
       //It assigns myPlacesList to data.placesToGo, which is an array of 
       //objects for each place-to-go that has been saved by the current user.
       //The googleMapsService.initialize method is then called in order to 
       //add markers to the map 
        retrievePlaces : function($http, ctrl, googleMapsService, $rootScope) {
              $http.get("api/users/places") 
                .success(function(data) {
                  ctrl.myPlacesList = data.placesToGo;
                  googleMapsService.initialize(ctrl);
              })
                 .error(function(data) {
                    ctrl.errorOccurred = true;
              })
       },

       //removePlace method is called by main controller, and takes an id 
       //for a saved place-to-go. It sends the placeId to the server, which
       //deletes the place-to-go, then assigns myPlacesList to the returned
       //data, which is an array of objects for each place-to-go that has been
       //saved by the current user
        removePlace : function(placeId, $http, ctrl, googleMapsService) {
              $http.post("api/users/removePlace", {placeId : placeId}) 
                .success(function(data) {
                  document.location.reload();
              })
                .error(function(data) {
                  ctrl.errorOccurred = true;
              })
       }
    };
  });
