'use strict';

angular.module('travelPhotosApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('friendPosts', {
        url: '/friendPosts/:friendName',
        templateUrl :  'app/friendPosts/friendPosts.html',
        controller : 'FriendpostsCtrl as fpCtrl',
        authenticate: true
      });
  });