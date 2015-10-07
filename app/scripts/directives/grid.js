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
          templateUrl: '../views/linkcard.html',
          scope: { list: '=' },
          controller: function ($scope, $element, $attrs) {
              //Tiling code from the wonderful lor Anthony Estebe. Thank you so much
              //http://microblog.anthonyestebe.com/2013-12-14/grid-pinterest-like-with-angular/
              var _margin, _width, elemHeight, elemPerLine, elemWidth, gridWidth, margin, parent, width;
              parent = $element.parent()[0];
              _margin = null;
              _width = null;


              //Variables to edit margin and width
              var maxMargin = 10;
              var maxWidth = 450;

              margin = function () {
                  return _margin || (_margin = parseInt($attrs.margin, 10) || maxMargin);
              };
              width = function () {
                  return _width || (_width = parseInt($attrs.width, 10) || maxWidth);
              };
              elemWidth = function () {
                  return width() + 2 * margin();
              };
              elemHeight = function (height) {
                  return height + 2 * margin();
              };
              elemPerLine = function () {
                  return parseInt(parent.offsetWidth / elemWidth(), 10);
              };
              gridWidth = function () {
                  return elemPerLine() * elemWidth();
              };
              return $scope.computePositions = function () {
                  var bottom, bottoms, elem, height, i, index, j, k, left, len, len1, maxHeight, ref, top;
                  bottoms = function () {
                      var j, ref, results;
                      results = [];
                      for (i = j = 0, ref = elemPerLine(); 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
                          results.push(0);
                      }
                      return results;
                  }();
                  maxHeight = 0;
                  ref = $element.children();
                  for (i = j = 0, len = ref.length; j < len; i = ++j) {
                      elem = ref[i];
                      elem.style.height = $scope.list[i].height + 'px';
                      top = null;
                      index = 0;
                      for (i = k = 0, len1 = bottoms.length; k < len1; i = ++k) {
                          bottom = bottoms[i];
                          if (!(top == null || top > bottom)) {
                              continue;
                          }
                          top = bottom;
                          index = i;
                      }
                      left = index * elemWidth() % gridWidth() + margin();
                      height = top + elemHeight(elem.offsetHeight);
                      if (maxHeight < height) {
                          maxHeight = height;
                      }
                      bottoms[index] = height;
                      elem.style.left = left + 'px';
                      elem.style.top = top + margin() + 'px';
                      elem.style.width = width() + 'px';
                  }
                  return {
                      width: gridWidth() + 'px',
                      height: maxHeight + 'px'
                  };
              };
          }
      };
  });
