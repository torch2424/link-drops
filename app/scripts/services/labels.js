'use strict';

/**
 * @ngdoc service
 * @name linkDumpApp.Dumps
 * @description
 * # Dumps
 * Service in the linkDumpApp.
 */
angular.module('linkDumpApp')
  .factory('Labels', ['$resource', 'ENV', function($resource, ENV) {

    return $resource(ENV.API_BASE + '/labels/', {}, {
      get: {
        method: 'GET',
        params: {},
        isArray: true
      },
      save: {
        method: 'POST',
        params: {},
        isArray: false
      }

    });

  }]);

angular.module('linkDumpApp')
  .factory('Label', ['$resource', 'ENV', function($resource, ENV) {

    return $resource(ENV.API_BASE + '/labels/:id', {
      id: '@id'
    }, {
      delete: {
        method: 'DELETE',
        params: {
          id: '@id'
        },
        isArray: false
      }
    });

  }]);
