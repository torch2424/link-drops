'use strict';

/**
 * @ngdoc service
 * @name linkDumpApp.Users
 * @description
 * # Users
 * Service in the linkDumpApp.
 */
angular.module('linkDumpApp')
    .factory('Login', ['$resource', function($resource) {

    return $resource( '/users/login',
        { }, {
            submit: {
                method: 'POST',
                params: {},
                isArray: false
            }

        } );
}]);

angular.module('linkDumpApp')
    .factory('Join', ['$resource', function($resource) {

    return $resource( '/users/join',
        { }, {
            submit: {
                method: 'POST',
                params: {},
                isArray: false
            }

        } );
}]);

angular.module('linkDumpApp')
    .factory('Join', ['$resource', function($resource) {

    return $resource( '/users/join',
        { }, {
            submit: {
                method: 'POST',
                params: {},
                isArray: false
            }

        } );
}]);
