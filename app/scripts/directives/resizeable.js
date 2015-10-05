'use strict';

/**
 * @ngdoc directive
 * @name linkDumpApp.directive:resizeable
 * @description
 * # resizeable
 From: http://microblog.anthonyestebe.com/2013-12-14/grid-pinterest-like-with-angular/
 */
angular.module('linkDumpApp')
  .directive('resizeable', function () {
      return function($scope) {
        $scope.initializeWindowSize = function() {
          $scope.windowHeight = $window.innerHeight;
          return $scope.windowWidth = $window.innerWidth;
        };
        $scope.initializeWindowSize();
        return angular.element($window).bind('resize', function() {
          $scope.initializeWindowSize();
          return $scope.$apply();
        });
      };
  });
