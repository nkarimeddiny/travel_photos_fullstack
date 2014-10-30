'use strict';

angular.module('travelPhotosApp')
  .controller('MypostsCtrl', function ($scope) {
    $scope.message = 'Hello';
  });
  var app = angular.module('travelPhotosApp');

app.controller('MyPostsCtrl', function ($scope, $http, postingService) {
    var ctrl = this;

    postingService.retrievePosts("Navid", $http, ctrl);

    this.addPost = function() {
       postingService.addPost("Navid", myPostForm.caption.value, ctrl, $http, $scope);
    }

});

app.factory("postingService", function() {
    return {
      addPost : function(name, caption, ctrl, $http) {
          $http.post("http://localhost:3000/addPosts", {username: name, caption: caption})
             .success( function(data) {
                console.log(data);
                ctrl.userPosts = data;
          });
      },
      retrievePosts : function(name, $http, ctrl) {
          $http.post("http://localhost:3000/posts", {username: name})
             .success( function(data) {
                ctrl.userPosts = data;
          });
      }
   }
});
