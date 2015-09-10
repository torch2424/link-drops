'use strict';

/**
 * @ngdoc service
 * @name linkDumpApp.Dumps
 * @description
 * # Dumps
 * Service in the linkDumpApp.
 */
angular.module('linkDumpApp')
.factory('Dumps', ['$resource', function($resource) {

 return $resource(window.location.protocol + "//" + apiBase + '/dumps/',
     { }, {
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
.factory('Dump', ['$resource', function($resource) {

 return $resource(window.location.protocol + "//" + apiBase + '/dumps/:id',
     { id: '@id' }, {
         update: {
              method: 'PUT',
              params: { id: '@id' },
              isArray: false
          },
          delete: {
              method: 'DELETE',
              params: { id: '@id' },
              isArray: false
          }
     });

}]);
