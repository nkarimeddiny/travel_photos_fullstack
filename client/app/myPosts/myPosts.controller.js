'use strict';

angular.module('travelPhotosApp')
  .controller('MypostsCtrl', function ($scope) {
    $scope.message = 'Hello';
  });
  var app = angular.module('travelPhotosApp');

app.controller('MyPostsCtrl', function ($scope, $http, postingService) {
    var ctrl = this;
    ctrl.userPosts = {};

    postingService.retrievePosts($http, ctrl);

    this.addPost = function() {
       postingService.addPost(myPostForm.caption.value, ctrl, $http);
    };
    this.removePost = function(postId) {
       postingService.removePost($http, ctrl, postId);
    };

});


