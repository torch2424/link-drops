'use strict';

/**
 * @ngdoc function
 * @name linkDumpApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the linkDumpApp
 */
angular.module('linkDumpApp')
  .controller('MainCtrl', function ($scope, $location, $cookies, Session) {

    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.autoLogin = function()
    {
        //First check if there is a sessionToken in the cookies
        var sessionToken = $cookies.get("sessionToken");
        //If it exists, validate
        if(sessionToken)
        {
            //create json
            var data = {
                "token" : sessionToken
            };

            //Validate
            Session.validate(data,
            function(data, status) {
                //Session is valid! Redirect.
                $location.path("/dumps");
            }, function(data, status) {
                //Session is not valid!
            });
        }
    }

  });
