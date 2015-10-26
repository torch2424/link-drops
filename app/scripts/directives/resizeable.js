'use strict';

/**
 * @ngdoc directive
 * @name linkDumpApp.directive:resizeable
 * @description
 * # resizeable
 From: http://microblog.anthonyestebe.com/2013-12-14/grid-pinterest-like-with-angular/
 */
angular.module('linkDumpApp')
  .directive('resize', function ($window) {
      return function($scope) {
        $scope.initializeWindowSize = function() {
          $scope.windowHeight = $window.innerHeight;
          $scope.windowWidth  = $window.innerWidth;
        };
            angular.element($window).bind("resize", function() {
            $scope.initializeWindowSize();
            $scope.$apply();
        });
        
        $scope.initializeWindowSize();
      }
  });
