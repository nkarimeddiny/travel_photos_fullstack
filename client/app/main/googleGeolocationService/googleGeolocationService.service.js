'use strict';

angular.module('travelPhotosApp')
  .factory("googleGeolocationService", function() {

      var geocoder = new google.maps.Geocoder();

      return {

        //geolocate method is called by the main controller. It takes a
        //submitted form that has an address, and calls the geocode method.
        //Unless there's an error, the geocode method returns the longitude
        //and latitude at the address. A place object is then created, and
        //the postingService.addPlace method is called in order to save this 
        //object
        geolocate : function(placeForm, ctrl, $scope, googleMapsService,
                            $http, placeService) {
          geocoder.geocode({ 'address': placeForm.address.value }, 
            function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
              var place = {
                location: placeForm.place.value,
                text: placeForm.comment.value, 
                latitude : results[0].geometry.location.lat(),
                longitude : results[0].geometry.location.lng()
              };

              $scope.$apply();
        
              placeService.addPlace(place, $http, ctrl,
                                googleMapsService, true);
          }
         
          else {
              var alertString = "There's been an error finding the geolocation" +
                                "of that address. Please refresh the page."
              alert(alertString);
          }

         });
      }
     }; 
  });
