'use strict';

/**
 * @ngdoc service
 * @name linkDumpApp.Users
 * @description
 * # Users
 * Service in the linkDumpApp.
 */

//For nodemon use http://localhost:3000/


angular.module('linkDumpApp')
  .factory('Login', ['$resource', function($resource) {

    return $resource(window.location.protocol + "//" + apiBase + '/users/login', {}, {
      submit: {
        method: 'POST',
        params: {},
        isArray: false
      }

    });
  }]);

angular.module('linkDumpApp')
  .factory('Join', ['$resource', function($resource) {

    return $resource(window.location.protocol + "//" + apiBase + '/users/join', {}, {
      submit: {
        method: 'POST',
        params: {},
        isArray: false
      }

    });
  }]);

angular.module('linkDumpApp')
  .factory('UserUpdate', ['$resource', function($resource) {

    return $resource(window.location.protocol + "//" + apiBase + '/users/', {}, {
      update: {
        method: 'PUT',
        params: {},
        isArray: false
      }

    });
  }]);

angular.module('linkDumpApp')
  .factory('Forgot', ['$resource', function($resource) {

    return $resource(window.location.protocol + "//" + apiBase + '/users/forgot', {}, {
      forgot: {
        method: 'POST',
        params: {},
        isArray: false
      }

    });
  }]);

angular.module('linkDumpApp')
  .factory('Session', ['$resource', function($resource) {

    return $resource(window.location.protocol + "//" + apiBase + '/users/session', {}, {
      validate: {
        method: 'GET',
        params: {},
        isArray: false
      }

    });
  }]);
