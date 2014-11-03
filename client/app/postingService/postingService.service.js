'use strict';

angular.module('travelPhotosApp')
  .factory("postingService", function() {
      return {
        addPost : function(caption, ctrl, $http) {
            $http.post("/api/users/addPost", {username: name, caption: caption})
               .success( function(data) {
                  console.log(data);
                  ctrl.userPosts = data;
        });
      },
        retrievePosts : function($http, ctrl, optionalFriendName) {
             $http.post("api/users/getPosts", {friendName: optionalFriendName})
               .success( function(data) {
                console.log(data);
                ctrl.userPosts = data;
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
       }
      };
});
