'use strict';

/**
 * @ngdoc service
 * @name linkDumpApp.Toasty
 * @description
 * # Toasty
 * Service in the linkDumpApp.
 */
angular.module('linkDumpApp')
  .service('Toasty', function ($mdToast) {

      //Our functions to return
      var toastFunctions = {

          show: function(message, delay) {

              //Grab the delay if passed
              var showDelay = 3000;
              if(delay) showDelay = delay;

              $mdToast.show(
                $mdToast.simple()
                  .content(message)
                  .position('top right')
                  .hideDelay(showDelay)
              );
          }
      }
      return toastFunctions;
  });
