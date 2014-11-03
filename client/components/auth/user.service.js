'use strict';

angular.module('travelPhotosApp')
  .factory('User', function ($resource) {
    //    return $resource('/api/users/:id/:controller', {
    return $resource('/api/users/:id', {
      id: '@_id'
    },
    {
      changePassword: {
        method: 'PUT',
        params: {
          controller:'password'
        }
      },
      get: {
        method: 'GET',
        params: {
          id:'me'
        }
      }
	  });
  });
