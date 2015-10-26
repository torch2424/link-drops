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
  .factory('Login', ['$resource', 'ENV', function($resource, ENV) {

    return $resource(ENV.API_BASE + '/users/login', {}, {
      submit: {
        method: 'POST',
        params: {},
        isArray: false
      }

    });
  }]);

angular.module('linkDumpApp')
  .factory('Join', ['$resource', 'ENV', function($resource, ENV) {

    return $resource(ENV.API_BASE + '/users/join', {}, {
      submit: {
        method: 'POST',
        params: {},
        isArray: false
      }

    });
  }]);

angular.module('linkDumpApp')
  .factory('UserUpdate', ['$resource', 'ENV', function($resource, ENV) {

    return $resource(ENV.API_BASE + '/users/', {}, {
      update: {
        method: 'PUT',
        params: {},
        isArray: false
      }

    });
  }]);

angular.module('linkDumpApp')
  .factory('Forgot', ['$resource', 'ENV', function($resource, ENV) {

    return $resource(ENV.API_BASE + '/users/forgot', {}, {
      forgot: {
        method: 'POST',
        params: {},
        isArray: false
      }

    });
  }]);

angular.module('linkDumpApp')
  .factory('Session', ['$resource', 'ENV', function($resource, ENV) {

    return $resource(ENV.API_BASE + '/users/session', {}, {
      validate: {
        method: 'GET',
        params: {},
        isArray: false
      }

    });
  }]);
