'use strict';

/**
 * @ngdoc service
 * @name linkDumpApp.Dumps
 * @description
 * # Dumps
 * Service in the linkDumpApp.
 */
angular.module('linkDumpApp')
  .factory('Labels', ['$resource', function($resource) {

    return $resource(window.location.protocol + "//" + apiBase + '/labels/', {}, {
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
  .factory('Label', ['$resource', function($resource) {

    return $resource(window.location.protocol + "//" + apiBase + '/labels/:id', {
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
