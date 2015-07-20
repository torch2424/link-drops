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
   $scope.signUp = function ()
   {
       //Check if the passwords match
       if($scope.signup.password.indexOf($scope.signup.confirm) > -1)
       {
           //Signup the user, and save their session token
           $scope.token = Join.submit($scope.signup);

           //Save the sessionToken in cookies
           $cookieStore.put("sessionToken", $scope.token);

           //Send them to the links page
           $location.path("/links");

       }
       else
       {
           //If they dont error to the users

           alert("Your passwords dont match!");
       }
   }

  });
