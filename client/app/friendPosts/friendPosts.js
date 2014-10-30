'use strict';

angular.module('travelPhotosApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('friendPosts', {
        url: '/friendPosts',
        templateUrl: 'app/friendPosts/friendPosts.html',
        controller: 'FriendpostsCtrl'
      });
  });