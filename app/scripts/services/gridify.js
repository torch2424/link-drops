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
      //Keep the width same as sass variable
      var options =
      {
           srcNode: 'li',             // grid items (class, node)
           margin: '25px',             // margin in pixel, default: 0px
           width: '300px',             // grid item width in pixel, default: 220px
           max_width: '500px',              // dynamic gird item width if specified, (pixel)
           resizable: true,            // re-layout if window resize
      }

      var gridifyFunctions = {

          refreshGrid: function() {
              $timeout(function(){
                  if(document.getElementById(gridId)) document.getElementById(gridId).gridify(options);
                  else console.log("Grid not found!");
              }, 0);
          }
      }

      return gridifyFunctions;
  });
