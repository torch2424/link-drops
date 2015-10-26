'use strict';

/**
 * @ngdoc function
 * @name linkDumpApp.controller:ActivenavCtrl
 * @description
 * # ActivenavCtrl
 * Controller of the linkDumpApp
 */
angular.module('linkDumpApp')
  .controller('NavCtrl', function($scope, $location, $cookies) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    //Function to determine if we have a collapsing navbar
    $scope.isMobile = function() {

        //Check to see if the css rule for the collapsible applies
        var mq = window.matchMedia('(max-width: 767px)');

        return mq.matches;
    }

    //Fucntion to find the active page
    $scope.isActive = function(route) {
      return route === $location.path();
    }

    //Try to get our session token
    $scope.isLoggedIn = function() {
      //Get the session token, and if it doesnt exists, return true
      var sessionToken = $cookies.get("sessionToken");
      if (sessionToken != null && sessionToken.length > 1) {
        return true;
      } else {
        return false;
      }

    }

    //Log out the user
    $scope.logout = function() {
      //Set the session token to blank
      $cookies.remove("sessionToken");

      //Send the user back to home
      $location.path("/");

      //Also, called is logged in for nav links
      $scope.isLoggedIn();
    }

  });
