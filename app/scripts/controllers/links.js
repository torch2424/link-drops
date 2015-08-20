'use strict';

/**
 * @ngdoc function
 * @name linkDumpApp.controller:LinksCtrl
 * @description
 * # LinksCtrl
 * Controller of the linkDumpApp
 */
angular.module('linkDumpApp')
  .controller('LinksCtrl', function ($scope, $sce, $cookies, $timeout, Dumps, $location) {

    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    //Get our sessions token
    var sessionToken = $cookies.get("sessionToken");

    //inititalizes our dumps
    $scope.dumps;

    //Initialize soundcloud
    SC.initialize({
        client_id: 'YOUR_CLIENT_ID'
    });

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
                Materialize.toast(dumpResponse.msg, 3000);
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
        return $sce.trustAsResourceUrl("https://www.youtube.com/embed/" + theLink.split("https://www.youtube.com/watch?v=")[1]);
    }

    //Get a sce trusted iframe vimeo link
    $scope.getVimeoFrame = function(theLink)
    {
        //Get the link on the 33 substring, and trust it
        return $sce.trustAsResourceUrl("https://player.vimeo.com/video/" + theLink.split("https://vimeo.com/")[1] + "?color=ffffff&title=0&portrait=0&badge=0");
    }

    //get a sce trusted soundcloud thingy
    $scope.getSoundCloud = function(theLink)
    {
        //Did this worng use this
        //https://developers.soundcloud.com/docs/api/guide#playing

        console.log('sc-widget-' + theLink);
        //Got from the soundcloud docs https://developers.soundcloud.com/blog/html5-widget-api
        var widgetIframe = document.getElementById('sc-widget-' + theLink);
        var widget       = SC.Widget(widgetIframe);
        var newSoundUrl = theLink;

        //trust the link
        $sce.trustAsResourceUrl(newSoundUrl);

        widget.bind(SC.Widget.Events.READY, function() {
             // load new widget
             widget.bind(SC.Widget.Events.FINISH, function() {
                   widget.load(newSoundUrl, {
                     //show the artwork
                     //show_artwork: false
                   });
             });
         });
    }

    //Submit a dumped link
    $scope.submitLink = function ()
    {
        //Need to set a slight timeout for ng paste
        $timeout(function () {
            //Our json we will submit to the backend
            var enterJson = {
                "token": sessionToken,
                "content": $scope.enteredLink
            };

            //Save the link
            var saveRes = Dumps.save(enterJson, function(){
                if(saveRes.errorid)
                {
                    Materialize.toast(saveRes.msg, 3000);
                    return;
                }
                else {
                    //Set enetered link back to null
                    $scope.enteredLink = "";

                    //Inform user of the dump
                    Materialize.toast("Dumped!", 3000);

                    //Re-get all ouf our links!
                    $scope.getDumps();
                }
            });
        }, 1);
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
                Materialize.toast(remRes.msg, 3000);
                return;
            }
            else {
                //Re-get all ouf our links!
                $scope.getDumps();
            }
        });
    }


  });
