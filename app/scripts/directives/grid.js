'use strict';

/**
 * @ngdoc directive
 * @name linkDumpApp.directive:grid
 * @description
 * # grid
 From: http://microblog.anthonyestebe.com/2013-12-14/grid-pinterest-like-with-angular/
 */
angular.module('linkDumpApp')
  .directive('grid', function () {
      return {
          restrict: 'E',
          replace: true,
          //Need to create our own html file here
          //And copy pasta logic from old controller
          //Needed to make url paths similar to app.js, or else wont build the path correctly
          templateUrl: 'views/linkcard.html',
          controller: function ($scope, $element) {

              //Tiling code from the wonderful lor Anthony Estebe. Thank you so much
              //http://microblog.anthonyestebe.com/2013-12-14/grid-pinterest-like-with-angular/
              var elemHeight, elemPerLine, elemWidth, gridWidth, margin, parent, width;
              parent = $element.parent()[0];

              //Variables to edit margin and width
              //(Must be consistent with the max-width css in .linkCard class,
              // variable linkCard Width)
              //Get rid of $attrs, and use the parent offset width and stuff to set
              //a function name get width of get margin
              var maxMargin = 10;
              var maxWidth = 425;

                margin = function() {
                  return maxMargin;
                };
                width = function() {
                    //Value we cannot be larger than,
                    //or else breaks responsiveness
                    var parentWidth = parent.offsetWidth - 2 * maxMargin;
                    if(maxWidth >= parentWidth)
                    {
                        return parentWidth;
                    }
                    else {
                        return maxWidth;
                    }
                };
                elemWidth = function() {
                  return width() + 2 * margin();
                };
                elemHeight = function(height) {
                  return height + 2 * margin();
                };
                elemPerLine = function() {
                  return parseInt(parent.offsetWidth / elemWidth(), 10);
                };
                gridWidth = function() {
                  return elemPerLine() * elemWidth();
                };
          }
      }
  });
