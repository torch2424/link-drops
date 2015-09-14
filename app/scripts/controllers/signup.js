'use strict';

/**
 * @ngdoc function
 * @name linkDumpApp.controller:SignupCtrl
 * @description
 * # SignupCtrl
 * Controller of the linkDumpApp
 */
angular.module('linkDumpApp')
  .controller('SignupCtrl', function($scope, $location, $cookies, Join) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    //Fucntion to find the active page
    $scope.isActive = function(route) {
      return route === $location.path();
    }

    //Function to signup
    $scope.submitInfo = function() {
      //Check if the passwords match
      if ($scope.signup.password.indexOf($scope.signup.confirm) > -1) {
        //Signup the user, and save their session token
        var joinResponse = Join.submit($scope.signup,
          function(data, status) {
            //Save the sessionToken in cookies
            $cookies.put("sessionToken", data.token);

            //Thank user for joining
            Materialize.toast("Welcome to linkDump!", 3000);

            //Send them to the links page
            $location.path("/dumps");
          },
          function(err) {
            Materialize.toast(err.data.msg, 3000);
          });

      } else {
        //If they dont error to the users
        Materialize.toast("Passwords do not match!", 3000);
      }
    }

  });
