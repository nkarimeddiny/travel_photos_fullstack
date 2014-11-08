'use strict';

angular.module('travelPhotosApp')
  .controller('MypostsCtrl', 
    function (Auth, $scope, $http, postingService) {
    
    var ctrl = this;
    this.userPosts = {};
    this.lowResImageIds = {};  //lowResImageIds is used to 
    //determine whether or not an image retrieved from Instagram
    //has already been posted, and is populated by 
    //postingService.retrievePosts method
    this.thumbnailImages = {};
    this.thumbnailImagesIsEmpty = true; //thumbnailImagesIsEmpty 
    //is used to determine whether or not to show the button for
    //retrieving Instagram images
    this.isInstagramUser;  //isInstagramUser is used to determine 
    //whether or not to show the button for retrieving Instagram images

    postingService.retrieveMyPosts($http, ctrl);

    var currentUser = Auth.getCurrentUser();
    this.isInstagramUser = (currentUser.provider === 'instagram');

    this.addPost = function(imageLink, caption, 
                            instagramLink, imageId) {
       postingService.addPost(imageLink, caption, instagramLink, 
                              imageId, ctrl, $http);
    };

    this.removePost = function(postId) {
       postingService.removePost($http, ctrl, postId);
    };

    this.accessInstagram = function() {
        $http.get("api/users/accessInstagram")
          .success( function(data) {
            data.data.forEach(function(post, index) { 
              if (!ctrl.lowResImageIds[post.id]) {
               //if the image retrieved from Instagram hasn't
               //already been posted: 
                ctrl.thumbnailImages[index] = 
                   {id : post.id,
                   instagramLink : post.link,
                   lowresLink: post.images.low_resolution.url,
                   thumbnailLink: post.images.thumbnail.url,
                   caption : post.caption.text};
               }
            });
            ctrl.thumbnailImagesIsEmpty = $.isEmptyObject(ctrl.thumbnailImages);
        });
    };

});


