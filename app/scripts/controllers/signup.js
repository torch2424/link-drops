'use strict';

/**
 * @ngdoc function
 * @name linkDumpApp.controller:SignupCtrl
 * @description
 * # SignupCtrl
 * Controller of the linkDumpApp
 */
angular.module('linkDumpApp')
  .controller('SignupCtrl', function($scope, $location, $cookies,
      Join, Toasty) {
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
          var emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|edu|gov|mil|biz|info|mobi|name|aero|asia|jobs|museum)\b/;
          if(emailRegex.test($scope.signup.username)){
              //Signup the user, and save their session token
              var joinResponse = Join.submit($scope.signup,
                function(data, status) {

                  //Save the sessionToken in cookies
                  $cookies.put("sessionToken", data.token);

                  //Toast the welcome
                  Toasty.show('Welcome to linkDrops!');

                  //Send them to the links page
                  $location.path("/dumps");
                },
                function(err) {

                    //Toast the error
                    Toasty.show(err.data.msg);
                });
          } else {

              //Toast email error
              Toasty.show('Email is not valid!');
          }
      } else {

        //Toast password error
        Toasty.show('Passwords is not valid!');
      }
    }

  });
