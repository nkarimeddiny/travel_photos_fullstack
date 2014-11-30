'use strict';

angular.module('travelPhotosApp')
  .controller('MypostsCtrl', 
    function (Auth, $scope, $http, 
              postingService) {
    var ctrl = this;

    this.errorOccurred = false;

    this.userPosts = [];
    this.lowResImageIds = {};  //lowResImageIds is used to 
    //determine whether or not an image retrieved from Instagram
    //has already been posted, and is populated by 
    //postingService.retrievePosts method
    this.thumbnailImages = {};
    this.alreadyAccessedInstagram = false; //alreadyAccessedInstagram
    //is used to determine whether or not to show the button for
    //retrieving Instagram images
    this.isInstagramUser;  //isInstagramUser is also used to determine 
    //whether or not to show the button for retrieving Instagram images
    this.noMoreImages = false; //noMoreImages is used
    //to determine whether or not to show a message to the user that
    //all of their Instagram images have been retrieved
    this.next_max_id; //for retrieving more Instagram photos

    postingService.retrieveMyPosts($http, ctrl);

    this.displayNum; //set in postingService
    this.increaseDisplayNum = function() {
      if (ctrl.displayNum <= ctrl.userPosts.length - 3) {
      ctrl.displayNum += 3;
      }
      else {
      ctrl.displayNum = ctrl.userPosts.length;
      }
    }

    //length of returnArray determines how many posts
    //will be displayed (because of ng-repeat attritbute)
    this.returnArray = function(num) {
      var arr = []; 
      for (var i = 0; i < num; i++) {
        arr.push(i);
      }
     return arr;
     };

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

    var prepThumbnailImgs = function(data) {
        ctrl.next_max_id = data.pagination.next_max_id;
        if (data.data.length < 10) {
          ctrl.noMoreImages = true;
        }
        data.data.forEach(function(post, index) { 
          if (!ctrl.lowResImageIds[post.id]) {
           //if the image retrieved from Instagram hasn't
           //already been posted: 
            ctrl.thumbnailImages[index] = 
               {id : post.id,
               instagramLink : post.link,
               lowresLink: post.images.low_resolution.url,
               thumbnailLink: post.images.thumbnail.url,
               }
               if (post.caption) {
                 ctrl.thumbnailImages[index].caption = post.caption.text;
               }
          };
        });
        ctrl.alreadyAccessedInstagram = true;
        if (data.data.length > 0 && $.isEmptyObject(ctrl.thumbnailImages)) {
          ctrl.allRecentImagesPosted = true;
        };
    };

    this.accessInstagram = function(next_max_id) {
        if (!next_max_id) {
          $http.get("api/users/accessInstagram")
            .success(function(data) {
                prepThumbnailImgs(data);
            });
        }
        else {
          $http.get("api/users/accessInstagram/" + next_max_id)
            .success(function(data) {
                prepThumbnailImgs(data);
            });

        } 
    };

});


