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
    };
});
