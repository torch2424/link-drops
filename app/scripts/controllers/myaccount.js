'use strict';

/**
 * @ngdoc function
 * @name linkDumpApp.controller:MyaccountCtrl
 * @description
 * # MyaccountCtrl
 * Controller of the linkDumpApp
 */
angular.module('linkDumpApp')
  .controller('MyaccountCtrl', function($scope, $cookies,
      UserUpdate, Toasty) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    //Get our sessions token
    var sessionToken = $cookies.get("sessionToken");

    $scope.submitUsername = function(){
        if($scope.username.username == $scope.username.confirm){
            var payload = {
              "token": sessionToken,
              "password": $scope.username.username
            };

            UserUpdate.update(payload,
              function(data, status) {

                  //Toast the confirmation
                  Toasty.show("New Email Saved!");
              },
              function(err) {
                if (err.status == 401) {
                  //Session is invalid! Redirect.
                  $location.path("/");
                } else {
                  //Something else happened
                  //Toast the error
                  Toasty.show(err.data.msg);
                }
            });
        } else {

            //Toast the mistmatch
            Toasty.show("Username confirm doesn't match!");
        }
    }

    $scope.submitPassword = function(){
        if($scope.password.password == $scope.password.confirm){
            var payload = {
              "token": sessionToken,
              "password": $scope.password.password
            };

            UserUpdate.update(payload,
              function(data, status) {

                  //Toast the password
                  Toasty.show("New password saved!");
              },
              function(err) {
                if (err.status == 401) {
                  //Session is invalid! Redirect.
                  $location.path("/");
                } else {

                  //Toast the error
                  Toasty.show(err.data.msg);
                }
            });
        } else {

            //Toast the mistmatch
            Toasty.show("Username confirm doesn't match!");
        }
    }

  });
