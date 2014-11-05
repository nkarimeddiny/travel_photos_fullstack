'use strict';

angular.module('travelPhotosApp')
  .factory("googleGeolocationService", function() {

      var geocoder = new google.maps.Geocoder();

      return {

        geolocate : function(address, ctrl, $scope, googleMapsService, $http, postingService) {
          geocoder.geocode({ 'address': address }, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
              var place = {
                location: placeForm.place.value,
                text: placeForm.comment.value, 
                latitude : results[0].geometry.location.lat(),
                longitude : results[0].geometry.location.lng()
              };

              $scope.$apply();
        
              postingService.addPlace(place, $http, ctrl, googleMapsService)
              // $http.post("http://localhost:9000/api/users/addPlace", place) 
              //     .success(function(data) {
              //         ctrl.myPlacesList = data;
              //         googleMapsService.initialize(ctrl)
              //     });
          }
         
          else {
              alert("There's been an error finding the geolocation of that address. Please refresh the page.");
          }

         });
      }
     }; 
  });
