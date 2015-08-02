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
            var submitJson = {
                "token" : sessionToken
            };

            //Validate
            var submit = Session.validate(submitJson, function() {
                //Dont spit out any errors, just try to autologin
                if(!submit.errorid)
                {
                    //send them to the links page
                    $location.path("/dumps");
                }
            });
        }
    }

  });
