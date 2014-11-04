'use strict';

angular.module('travelPhotosApp')
  .controller('MypostsCtrl', function ($scope, $http, postingService) {
    
    $scope.message = 'Hello';

    var ctrl = this;
    ctrl.userPosts = {};

    postingService.retrievePosts($http, ctrl);

    this.addPost = function() {
       postingService.addPost(myPostForm.caption.value, ctrl, $http);
    };
    this.removePost = function(postId) {
       postingService.removePost($http, ctrl, postId);
    };

    this.accessInstagram = function() {
        $http.get("api/users/accessInstagram")
             .success( function(data) {
                 console.log(data);
        });
    };

});


