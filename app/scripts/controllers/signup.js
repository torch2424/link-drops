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
          var emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|edu|gov|mil|biz|info|mobi|name|aero|asia|jobs|museum)\b/;
          if(emailRegex.test($scope.signup.username)){
              //Signup the user, and save their session token
              var joinResponse = Join.submit($scope.signup,
                function(data, status) {
                  //Save the sessionToken in cookies
                  $cookies.put("sessionToken", data.token);

                  $mdToast.show(
                    $mdToast.simple()
                      .content('Welcome to linkDrops!')
                      .position('top left')
                      .hideDelay(3000)
                  );

                  //Send them to the links page
                  $location.path("/dumps");
                },
                function(err) {
                  Materialize.toast(err.data.msg, 3000);
                });
          } else {
              $mdToast.show(
                $mdToast.simple()
                  .content('Email is not valid!')
                  .position('top left')
                  .hideDelay(3000)
              );
          }
      } else {
        //If they dont error to the users
        $mdToast.show(
          $mdToast.simple()
            .content('Passwords do no match!')
            .position('top left')
            .hideDelay(3000)
        );
      }
    }

  });
