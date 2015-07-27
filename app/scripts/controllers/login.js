'use strict';

/**
 * @ngdoc function
 * @name linkDumpApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the linkDumpApp
 */
angular.module('linkDumpApp')
  .controller('LoginCtrl', function ($scope, $location, $cookieStore, Login) {
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
                 console.log("Error creating the giftcard");
                 return;
            }
            else {
                //Save the sessionToken in cookies
                $cookieStore.put("sessionToken", loginResponse.token);

                //Send them to the links page
                $location.path("/links");
            }
        });
    }


  });
