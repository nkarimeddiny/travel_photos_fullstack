'use strict';

angular.module('travelPhotosApp')
  .factory("postingService", function() {

    return {
      addPost : function(caption, ctrl, $http) {
          $http.post("http://localhost:9000/api/users/addPost", {username: name, caption: caption})
             .success( function(data) {
                console.log(data);
                ctrl.userPosts = data;
          });
      },
      retrievePosts : function($http, ctrl, optionalFriendName) {
           $http.post("http://localhost:9000/api/users/getPosts", {friendName: optionalFriendName})
             .success( function(data) {
              console.log(data);
              ctrl.userPosts = data;
    });
      },
      removePost : function($http, ctrl, postId) {
           $http.post("http://localhost:9000/api/users/removePost", {postId: postId})
             .success( function(data) {
              console.log(data);
              ctrl.userPosts = data;
    });
      }
   }
});
