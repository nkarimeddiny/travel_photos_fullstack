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
    }

});

app.factory("postingService", function() {
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
      }
   }
});
