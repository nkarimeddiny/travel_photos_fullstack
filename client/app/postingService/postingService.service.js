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
                           imageId, ctrl, $http) {
            $http.post("/api/users/addPost", 
                       {imageLink: imageLink, 
                        instagramLink: instagramLink, 
                        imageId: imageId, caption: caption})
                 .success( function(data) {
                    ctrl.userPosts = data;
                  });
        },

        //retrievePosts is called by friendPosts AND myPosts
        //controllers. When called by myPosts, it retrieves the
        //current user's posts. When called by friendPosts, it 
        //retrieves that friend's posts, by taking the friend's 
        //name as a third parameter. The callback function
        //assigns userPosts to data.posts, which is an array
        //containing an object for each of the user's posts.
        //The callback also populates the lowResImageIds object
        //with the id's of each of the posts, so that when 
        //thumbnail photos are retrieved from Instagram, photos
        //that have already been posted will not be displayed
        retrievePosts : function($http, ctrl, optionalFriendName) {
             $http.post("api/users/getPosts", 
                       {friendName: optionalFriendName})
               .success( function(data) {
                  ctrl.userPosts = data.posts;
                  if (!optionalFriendName) {
                    data.posts.forEach(function(post){
                      ctrl.lowResImageIds[post.imageId] = "hello";
                    });
                  }
        });
      },

        //removePost is called by myPosts controller. It takes
        //the post's id (not the image's Instagram id).
        //The callback function assigns userPosts to data,
        //which is an array containing an object for each of 
        //the user's posts.
        removePost : function($http, ctrl, postId) {
             $http.post("api/users/removePost", {postId: postId})
               .success( function(data) {
                  ctrl.userPosts = data;
               });
        }
    };
});
