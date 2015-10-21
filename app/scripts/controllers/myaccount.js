'use strict';

/**
 * @ngdoc function
 * @name linkDumpApp.controller:MyaccountCtrl
 * @description
 * # MyaccountCtrl
 * Controller of the linkDumpApp
 */
angular.module('linkDumpApp')
  .controller('MyaccountCtrl', function($scope, $cookies, UserUpdate) {
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
                  $mdToast.show(
                    $mdToast.simple()
                      .content("New Email Saved!")
                      .position('top right')
                      .hideDelay(3000)
                  );
              },
              function(err) {
                if (err.status == 401) {
                  //Session is invalid! Redirect.
                  $location.path("/");
                } else {
                  //Something else happened
                  $mdToast.show(
                    $mdToast.simple()
                      .content(err.data.msg)
                      .position('top right')
                      .hideDelay(3000)
                  );
                }
            });
        } else {
            $mdToast.show(
              $mdToast.simple()
                .content("Username confirm doesn't match!")
                .position('top right')
                .hideDelay(3000)
            );
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
                  $mdToast.show(
                    $mdToast.simple()
                      .content("New password saved!")
                      .position('top right')
                      .hideDelay(3000)
                  );
              },
              function(err) {
                if (err.status == 401) {
                  //Session is invalid! Redirect.
                  $location.path("/");
                } else {
                  //Something else happened
                  $mdToast.show(
                    $mdToast.simple()
                      .content(err.data.msg)
                      .position('top right')
                      .hideDelay(3000)
                  );
                }
            });
        } else {
            $mdToast.show(
              $mdToast.simple()
                .content("Username confirm doesn't match!")
                .position('top right')
                .hideDelay(3000)
            );
        }
    }

  });
