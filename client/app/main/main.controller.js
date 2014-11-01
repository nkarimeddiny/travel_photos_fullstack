'use strict';

angular.module('travelPhotosApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.awesomeThings = [];

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });
  });


var app = angular.module('travelPhotosApp');
  
  app.controller('MainCtrl', function ($scope, $http, googleMapsService, googleGeolocationService) {
     
    var ctrl = this;

    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    
    this.myPlacesList = [];


    googleMapsService.initialize(ctrl);  

    ctrl.placeInputError = false;
    ctrl.addressInputError = false;

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
        googleGeolocationService.geolocate(placeForm.address.value, ctrl, $scope, googleMapsService);
      }
    }; 
 
  });

  app.factory("googleGeolocationService", function() {

      var geocoder = new google.maps.Geocoder();

      return {

        geolocate : function(address, ctrl, $scope, googleMapsService) {
          geocoder.geocode({ 'address': address }, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
              ctrl.myPlacesList.push({
              date : Date.now(),
              location: placeForm.place.value,
              text: placeForm.comment.value, 
              latitude : results[0].geometry.location.lat(),
              longitude : results[0].geometry.location.lng()
              });

              $scope.$apply();
        
              //add code for saving data here
         
              googleMapsService.initialize(ctrl)
          }
         
          else {
              alert("There's been an error finding the geolocation of that address. Please refresh the page.");
          }

         });
      }
     }; 
  });

  app.factory("googleMapsService", function() {

      var mapOptions = {
          center: new google.maps.LatLng(0,0),
          zoom: 2,
          mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      var map = new google.maps.Map(document.getElementById('map-canvas'),
          mapOptions);

      return({

        initialize : function(ctrl) {

           for (var i = 0; i < ctrl.myPlacesList.length; i++){
              var lat = ctrl.myPlacesList[i].latitude;
              var lng = ctrl.myPlacesList[i].longitude;
              var myLatling = new google.maps.LatLng(lat,lng);
              var placeName = ctrl.myPlacesList[i].location;
              var marker = new google.maps.Marker({
                  position: myLatling,
                  map: map,
                  title: placeName
              });

              // var infoWindow = new google.maps.InfoWindow();
             
              // google.maps.event.addListener(marker, 'mousedown',function(){
              //     infoWindow.setContent(this.title);
              //     infoWindow.open(this.getMap(), this);
              // });
              }
         }//end intialize()  
    });
  });



