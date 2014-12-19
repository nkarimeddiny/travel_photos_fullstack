'use strict';

angular.module('travelPhotosApp')
  .factory('accessInstagramService', function ($http) {

    return {
      get: function(next_max_id) {
        if (!next_max_id) {
          return $http.get("api/users/accessInstagram");
        }
        else {
          return $http.get("api/users/accessInstagram/" + next_max_id);
        }

      }
    
    };
  });
