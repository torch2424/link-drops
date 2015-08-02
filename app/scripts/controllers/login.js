'use strict';

/**
 * @ngdoc function
 * @name linkDumpApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the linkDumpApp
 */
angular.module('linkDumpApp')
  .controller('LoginCtrl', function ($scope, $location, $cookies, Login) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    //Fucntion to find the active page
    $scope.isActive = function(route)
    {
       return route === $location.path();
    }

    //Function to signup
    $scope.submitInfo = function ()
    {
        //Signup the user, and save their session token
        var loginResponse = Login.submit($scope.login, function()
        {
            if(loginResponse.errorid)
            {
                 Materialize.toast(loginResponse.msg, 3000);
                 return;
            }
            else {
                //Save the sessionToken in cookies
                $cookies.put("sessionToken", loginResponse.token);

                //Thank user for joining
                Materialize.toast("Welcome back!", 3000);

                //Send them to the links page
                $location.path("/dumps");
            }
        });
    }


  });
