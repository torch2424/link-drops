'use strict';

/**
 * @ngdoc function
 * @name linkDumpApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the linkDumpApp
 */
angular.module('linkDumpApp')
  .controller('LoginCtrl', function($scope, $location, $cookies, Login, UserUpdate) {
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
      //Signup the user, and save their session token
      Login.submit($scope.login,
        function(data, status) {
          var emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|edu|gov|mil|biz|info|mobi|name|aero|asia|jobs|museum)\b/;
          if (emailRegex.test($scope.login.username)) {
            //Save the sessionToken in cookies
            $cookies.put("sessionToken", data.token);

            //Thank user for joining
            Materialize.toast("Welcome back!", 3000);

            //Send them to the links page
            $location.path("/dumps");
          } else {
            //Save the sessionToken for later callback
            var token = data.token;
            var newUsername = window.prompt("Enter your email.\nThis will be your new username. We are now using emails instead of usernames.", "example@example.com");
            if (emailRegex.test(newUsername)) {
                //Contact update server
                UserUpdate.update({
                    username: newUsername,
                    token: data.token
                  },
                  function(data, status) {
                    //Save the sessionToken in cookies
                    $cookies.put("sessionToken", token);

                    //Thank user for joining
                    Materialize.toast("Welcome back!", 3000);

                    //Send them to the links page
                    $location.path("/dumps");
                  },
                  function(err) {
                    Materialize.toast(err.data.msg, 3000);
                  });
            } else {
                Materialize.toast("Sorry, but without a valid email we cannot log you in.", 3000);
            }
          }
        },
        function(err) {
          Materialize.toast(err.data.msg, 3000);
        });
    }


  });
