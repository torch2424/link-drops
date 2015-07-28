'use strict';

/**
 * @ngdoc function
 * @name linkDumpApp.controller:LinksCtrl
 * @description
 * # LinksCtrl
 * Controller of the linkDumpApp
 */
angular.module('linkDumpApp')
  .controller('LinksCtrl', function ($scope, $sce, $cookies, Dumps) {

    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    //Get our sessions token
    var sessionToken = $cookies.get("sessionToken");

    //inititalizes our dumps
    $scope.dumps;

    //get our dumps
    $scope.getDumps = function()
    {
        var dumpResponse = Dumps.get(sessionToken, function()
        {
            if(dumpResponse.errorid)
            {

            }
            else {
                //Set scope.dumps to our dumps
                $scope.dumps = dumpResponse;
            }
        });
    }

    //Get a sce trusted iframe youtube link
    $scope.getYoutubeFrame = function(theLink)
    {
        //Get the link on the 33 substring, and trust it
        return $sce.trustAsResourceUrl("https://www.youtube.com/embed/" + theLink.substring(32));
    }

    //Submit a dumped link
    $scope.submitLink = function ()
    {
        //Our json we will submit to the backend
        
        Dumps.save("")
    }
  });
