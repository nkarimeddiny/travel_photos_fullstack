'use strict';

angular.module('travelPhotosApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('myPosts', {
        url: '/myPosts',
        templateUrl :  'app/myPosts/myPosts.html',
        controller : 'MypostsCtrl as mpCtrl',
        authenticate: true
      });
  });