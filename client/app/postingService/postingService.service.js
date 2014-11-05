'use strict';

angular.module('travelPhotosApp')
  .factory("postingService", function() {
      return {
        addPost : function(imageLink, caption, ctrl, $http) {
            $http.post("/api/users/addPost", {username: name, imageLink: imageLink, caption: caption})
               .success( function(data) {
                  console.log(data);
                  ctrl.userPosts = data;
        });
      },
        retrievePosts : function($http, ctrl, optionalFriendName) {
             $http.post("api/users/getPosts", {friendName: optionalFriendName})
               .success( function(data) {
                ctrl.userPosts = data.posts;
       });
      },
        removePost : function($http, ctrl, postId) {
             $http.post("api/users/removePost", {postId: postId})
               .success( function(data) {
                console.log(data);
                ctrl.userPosts = data;
       });
      },
        addPlace : function(place, $http, ctrl, googleMapsService) {
              $http.post("api/users/addPlace", place) 
                  .success(function(data) {
                      ctrl.myPlacesList = data;
                      googleMapsService.initialize(ctrl);
              });
       },
        removePlace : function(placeId, $http, ctrl) {
              $http.post("api/users/removePlace", {placeId : placeId}) 
                  .success(function(data) {
                      console.log(data);
                      ctrl.myPlacesList = data;
              });
       }
      };
});
