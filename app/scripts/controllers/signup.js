'use strict';

/**
 * @ngdoc function
 * @name linkDumpApp.controller:SignupCtrl
 * @description
 * # SignupCtrl
 * Controller of the linkDumpApp
 */
angular.module('linkDumpApp')
  .controller('SignupCtrl', function ($scope, $location, $cookieStore, Join) {
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
       //Check if the passwords match
       if($scope.signup.password.indexOf($scope.signup.confirm) > -1)
       {
           //Signup the user, and save their session token
           var joinResponse = Join.submit($scope.signup, function()
           {
               if(joinResponse.errorid)
               {
                    console.log("Error creating the giftcard");
                    return;
               }
               else {
                   //Save the sessionToken in cookies
                   $cookieStore.put("sessionToken", joinResponse.token);

                   //Send them to the links page
                   $location.path("/links");
               }
           });

       }
       else
       {
           //If they dont error to the users

           alert("Your passwords dont match!");
       }
   }

  });
