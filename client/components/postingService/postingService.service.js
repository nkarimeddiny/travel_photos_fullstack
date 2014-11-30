'use strict';

angular.module('travelPhotosApp')
  .factory("postingService", function() {
      return {


        //addPost is called by myPosts controller. It takes
        //the link to a CDN where the image is hosted, the link 
        //to where it can be viewed on Instagram, the image's 
        //Instagram id, and the image's caption.
        //The callback function assigns userPosts to data,
        //which is an array containing an object for each of 
        //the user's posts.
        addPost : function(imageLink, caption, instagramLink,
                           imageId, longitude, latitude, 
                           ctrl, $http) {
            $http.post("/api/users/post", 
                       {imageLink: imageLink, 
                        instagramLink: instagramLink, 
                        imageId: imageId, 
                        caption: caption,
                        longitude: longitude,
                        latitude: latitude
                      })
               .success( function(data) {
                  ctrl.userPosts = data;
                  ctrl.displayNum++;
               })
               .error(function(data) {
                  ctrl.errorOccurred = true;
               });
        },

        //retrieveMyPosts is called by myPosts controller,
        //and retrieves the current user's posts. The callback 
        //function assigns userPosts to data.posts, which is an 
        //array containing an object for each of the user's posts.
        //The callback also populates the lowResImageIds object
        //with the id's of each of the posts, so that when 
        //thumbnail photos are retrieved from Instagram, photos
        //that have already been posted will not be displayed
        retrieveMyPosts : 
          function($http, ctrl) {
             $http.get("api/users/posts/")
                .success( function(data) {
                  ctrl.userPosts = data.posts;
                  data.posts.forEach(function(post){
                    ctrl.lowResImageIds[post.imageId] = "hello";
                  });
                  ctrl.displayNum = Math.min(3, ctrl.userPosts.length);
                })
                .error(function(data) {
                  ctrl.errorOccurred = true;
                });
        },

        //retrieveFriendPosts is called by friendPosts controller, 
        //and retrieves a friend's posts. The callback function 
        //assigns userPosts to data.posts, which is an array 
        //containing an object for each of the user's posts.
        retrieveFriendPosts : 
          function($http, ctrl, friendName) {
             $http.get("api/users/posts/" + friendName)
                .success( function(data) {
                  ctrl.userPosts = data.posts;
                  ctrl.displayNum = Math.min(3, ctrl.userPosts.length);
                })
                .error(function(data) {
                  ctrl.errorOccurred = true;
                });
        },

        //removePost is called by myPosts controller. It takes
        //the post's id (not the image's Instagram id).
        //The callback function assigns userPosts to data,
        //which is an array containing an object for each of 
        //the user's posts, and re-populates the lowResImageIds
        //object, so that if the user removes a post and then
        //retrives Instagram thumbnails, they will see the
        //thumbnail for the picture they just removed
        removePost : function($http, ctrl, postId) {
             $http.post("api/users/removePost", {postId: postId})
               .success( function(data) {
                  ctrl.userPosts = data;
                  ctrl.lowResImageIds = {};
                  data.forEach(function(post){
                    ctrl.lowResImageIds[post.imageId] = "hello";
                  });
                  ctrl.displayNum--;
               })
                .error(function(data) {
                  ctrl.errorOccurred = true;
               });
        }
    };
});
