'use strict';

/**
 * @ngdoc function
 * @name linkDumpApp.controller:ActivenavCtrl
 * @description
 * # ActivenavCtrl
 * Controller of the linkDumpApp
 */
angular.module('linkDumpApp')
  .controller('NavCtrl', function ($scope, $location) {
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
   
  });
