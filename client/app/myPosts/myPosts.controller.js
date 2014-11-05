'use strict';

angular.module('travelPhotosApp')
  .controller('MypostsCtrl', function ($scope, $http, postingService) {
    
    $scope.message = 'Hello';

    var ctrl = this;
    ctrl.userPosts = {};
    ctrl.instagramImages = {};
    ctrl.instagramImagesIsEmpty = true;

    postingService.retrievePosts($http, ctrl);


    this.addPost = function(imageLink, caption) {
       postingService.addPost(imageLink, caption, ctrl, $http);
    };
    this.removePost = function(postId) {
       postingService.removePost($http, ctrl, postId);
    };

    this.accessInstagram = function() {
        $http.get("api/users/accessInstagram")
             .success( function(data) {
                 data.data.forEach(function(post, index){
                     ctrl.instagramImages[index] = 
                       {lowresLink: post.images.low_resolution.url,
                        thumbnailLink: post.images.thumbnail.url,
                        caption : post.caption.text};
                 });
                 ctrl.instagramImagesIsEmpty = $.isEmptyObject(ctrl.instagramImages);
        });
    };

});


