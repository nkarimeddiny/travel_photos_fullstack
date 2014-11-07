'use strict';

angular.module('travelPhotosApp')
  .factory("googleMapsService", function() {

      var mapOptions = {
          center: new google.maps.LatLng(0,0),
          zoom: 2,
          mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      var map = new google.maps.Map(document.getElementById('map-canvas'),
          mapOptions);

      return({

        //the initialize method creates a Google map in the #map-canvas
        //div, and adds markers
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

            var infoWindow = new google.maps.InfoWindow();
           
            google.maps.event.addListener(marker, 'mousedown',function(){
                infoWindow.setContent(this.title);
                infoWindow.open(this.getMap(), this);
            });
          }
          $(".placeFormInput").val(" ");
         }//end intialize()  
    });
  });
