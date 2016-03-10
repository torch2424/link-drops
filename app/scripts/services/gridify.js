'use strict';

/**
 * @ngdoc service
 * @name linkDumpApp.Gridify
 * @description
 * # Gridify
 * Service in the linkDumpApp.
 */
angular.module('linkDumpApp')
  .service('Gridify', function ($timeout) {

      //Our gridId
      var gridId = 'linkGrid'

      //Our gridify options
      //https://github.com/hongkhanh/gridify
      var options =
      {
           srcNode: 'li',             // grid items (class, node)
           margin: '20px',             // margin in pixel, default: 0px
           width: '500px',             // grid item width in pixel, default: 220px
           max_width: '',              // dynamic gird item width if specified, (pixel)
           resizable: true,            // re-layout if window resize
           transition: 'all 0.5s ease-in-out' // support transition for CSS3, default: all 0.5s ease
      }

      var gridifyFunctions = {

          refreshGrid: function() {

              //Do a slight timeout to cause a $scope.$apply();
              $timeout(function () {

                 if(document.getElementById(gridId)) document.getElementById(gridId).gridify(options);
                 else console.log("Grid not found!");
              }, 10);
          }
      }

      return gridifyFunctions;
  });
