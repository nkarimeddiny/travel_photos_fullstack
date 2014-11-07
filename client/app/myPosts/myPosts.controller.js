'use strict';

angular.module('travelPhotosApp')
  .controller('MypostsCtrl', 
    function (Auth, $scope, $http, postingService) {
    
    var ctrl = this;
    this.userPosts = {};
    this.lowResImageIds = {};
    this.thumbnailImages = {};
    this.thumbnailImagesIsEmpty = true;

    postingService.retrievePosts($http, ctrl);

    var currentUser = Auth.getCurrentUser();
    this.isInstagramUser = (currentUser.provider === 'instagram');

    this.addPost = function(imageLink, caption, instagramLink, imageId) {
       postingService.addPost(imageLink, caption, instagramLink, imageId, ctrl, $http);
    };
    this.removePost = function(postId) {
       postingService.removePost($http, ctrl, postId);
    };

    this.accessInstagram = function() {
        $http.get("api/users/accessInstagram")
             .success( function(data) {
                 data.data.forEach(function(post, index){
                     if (!ctrl.lowResImageIds[post.id]) {
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


