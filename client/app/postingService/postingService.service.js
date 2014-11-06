'use strict';

angular.module('travelPhotosApp')
  .factory("postingService", function() {
      return {
        addPost : function(imageLink, caption, instagramLink, imageId, ctrl, $http) {
            $http.post("/api/users/addPost", {username: name, imageLink: imageLink, 
                                             instagramLink: instagramLink, 
                                             imageId: imageId, caption: caption})
               .success( function(data) {
                  console.log(data);
                  ctrl.userPosts = data;
        });
      },
        retrievePosts : function($http, ctrl, optionalFriendName) {
             $http.post("api/users/getPosts", {friendName: optionalFriendName})
               .success( function(data) {
                ctrl.userPosts = data.posts;
                data.posts.forEach(function(post){
                  ctrl.lowResImageIds[post.imageId] = "hello";
                });
       });
      },
        removePost : function($http, ctrl, postId) {
             $http.post("api/users/removePost", {postId: postId})
               .success( function(data) {
                console.log(data);
                ctrl.userPosts = data;
       });
      },

      //addPlace method is called by googleGeolocationService, and takes a 
      //place object, which has info about a place-to-go. It sends the
      //place object to the server, then assigns myPlacesList to the returned
      //data, which is an array of objects for each place-to-go that has been
      //saved by the current user. The googleMapsService.initialize method is
      //then called in order to add markers to the map
        addPlace : function(place, $http, ctrl, googleMapsService) {
              $http.post("api/users/addPlace", place) 
                  .success(function(data) {
                      ctrl.myPlacesList = data;
                      googleMapsService.initialize(ctrl);
              });
       },

       //retrievePlaces method is called by main controller, and sends a 
       //request to the server for the current user's saved places-to-go.
       //It assigns myPlacesList to data.placesToGo, which is an array of 
       //objects for each place-to-go that has been saved by the current user.
       //The googleMapsService.initialize method is then called in order to 
       //add markers to the map 
        retrievePlaces : function($http, ctrl, googleMapsService) {
              $http.get("api/users/retrievePlaces") 
                  .success(function(data) {
                      ctrl.myPlacesList = data.placesToGo;
                      googleMapsService.initialize(ctrl);
              });
       },

       //removePlace method is called by main controller, and takes an id 
       //for a saved place-to-go. It sends the placeId to the server, which
       //deletes the place-to-go, then assigns myPlacesList to the returned
       //data, which is an array of objects for each place-to-go that has been
       //saved by the current user
        removePlace : function(placeId, $http, ctrl) {
              $http.post("api/users/removePlace", {placeId : placeId}) 
                  .success(function(data) {
                      ctrl.myPlacesList = data;
              });
       }
      };
});
