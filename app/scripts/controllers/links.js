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
        //Our json we will submit to the backend
        var dumpJson = {
            "token": sessionToken,
        };

        var dumpResponse = Dumps.get(dumpJson, function()
        {
            if(dumpResponse.errorid)
            {
                console.log(dumpResponse.msg);
            }
            else {
                //Get only the string
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
        var enterJson = {
            "token": sessionToken,
            "content": $scope.enteredLink
        };

        //Save the link
        var saveRes = Dumps.save(enterJson, function(){
            if(saveRes.errorid)
            {
                Materialize.toast(saveRes.msg);
                return;
            }
            else {
                //Set enetered link back to null
                $scope.enteredLink = "";

                //Re-get all ouf our links!
                $scope.getDumps();
            }
        });
    }

    //Remove a dumped link
    $scope.removeLink = function(dump)
    {
        //Our json we will submit to the backend
        var remJson = {
            "token": sessionToken,
            "id": dump._id
        };

        //Save the link
        var remRes = Dumps.delete(remJson, function(){
            if(remRes.errorid)
            {
                Materialize.toast(remJson);
                Materialize.toast(remRes.msg);
                return;
            }
            else {
                //Re-get all ouf our links!
                $scope.getDumps();
            }
        });
    }


  });
