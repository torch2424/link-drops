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
        template: "<div resize ng-style='computePositions()'><div ng-repeat='dump in list'></div></div>",
        scope: {
          list: "="
        },
        controller: function($scope, $element, $attrs) {
            console.log($scope.list);
            $scope.computePositions = function() {
              var bottom, bottoms, elem, height, i, index, left, maxHeight, top, _i, _j, _len, _len1, _ref;
              bottoms = (function() {
                var _i, _ref, _results;
                _results = [];
                for (i = _i = 0, _ref = elemPerLine(); 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                  _results.push(0);
                }
                return _results;
              })();
              maxHeight = 0;
              _ref = $element.children();
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                elem = _ref[_i];
                top = null;
                index = 0;
                for (i = _j = 0, _len1 = bottoms.length; _j < _len1; i = ++_j) {
                  bottom = bottoms[i];
                  if (!((top == null) || top > bottom)) {
                    continue;
                  }
                  top = bottom;
                  index = i;
                }
                left = (index * elemWidth()) % gridWidth() + margin();
                height = top + elemHeight(elem.offsetHeight);
                if (maxHeight < height) {
                  maxHeight = height;
                }
                bottoms[index] = height;
                elem.style.left = left + 'px';
                elem.style.top = top + margin() + 'px';
              }
              return {
                width: "" + (gridWidth()) + "px",
                height: "" + maxHeight + "px"
              };
            };


          var elemHeight, elemPerLine, elemWidth, gridWidth, margin, parent, width;
          parent = $element.parent()[0];
          margin = function() {
            return parseInt($attrs.margin, 10) || 15;
          };
          width = function() {
            return parseInt($attrs.width, 10) || 225;
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
          return $scope.computePositions = function() {};
        }
      };
  });
