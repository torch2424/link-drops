'use strict';

/**
 * @ngdoc function
 * @name linkDumpApp.controller:ActivenavCtrl
 * @description
 * # ActivenavCtrl
 * Controller of the linkDumpApp
 */
angular.module('linkDumpApp')
  .controller('NavCtrl', function ($scope, $location, $cookies) {
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

    //Try to get our session token
    $scope.isLoggedIn = function()
    {
        var sessionToken = $cookies.get("sessionToken");
        if(sessionToken)
        {
            return true;
        }
        else {
            return false;
        }
    }

  });
