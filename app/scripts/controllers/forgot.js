'use strict';

/**
 * @ngdoc function
 * @name linkDumpApp.controller:ActivenavCtrl
 * @description
 * # forgotCtrl
 * Controller of the linkDumpApp
 */
angular.module('linkDumpApp')
  .controller('ForgotCtrl', function($scope, $location, $cookies, $routeParams, Forgot, Session) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    if ($routeParams.token != "new") {
      //create json
      var data = {
        "token": $routeParams.token
      };

      //Validate
      Session.validate(data,
        function(data, status) {
          $cookies.put("sessionToken", $routeParams.token);
          //Session is valid! Redirect.
          $location.path("/myaccount");
        },
        function(err) {
          $location.path("/login");
        });
    }

    //Function to signup
    $scope.submitInfo = function() {
      var emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|edu|gov|mil|biz|info|mobi|name|aero|asia|jobs|museum)\b/;
      if (emailRegex.test($scope.forgot.username)) {
        Forgot.forgot($scope.forgot,
          function(data, status) {
              $mdToast.show(
                $mdToast.simple()
                  .content("Now, check your email!")
                  .position('top left')
                  .hideDelay(6000)
              );

            $location.path("/");
          },
          function(err) {
              $mdToast.show(
                $mdToast.simple()
                  .content(err.data.msg)
                  .position('top left')
                  .hideDelay(3000)
              );
          });
      } else {
          $mdToast.show(
            $mdToast.simple()
              .content("Only email-based accounts can use the reset-feature. Please contact devs.")
              .position('top left')
              .hideDelay(3000)
          );
      }
    }

  });
