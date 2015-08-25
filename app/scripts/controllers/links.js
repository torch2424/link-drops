'use strict';

/**
 * @ngdoc function
 * @name linkDumpApp.controller:LinksCtrl
 * @description
 * # LinksCtrl
 * Controller of the linkDumpApp
 */
angular.module('linkDumpApp')
  .controller('LinksCtrl', function ($scope, $sce, $cookies, $timeout, Dumps, $location, $http) {

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
        client_id: 'b9513e908ef7793171225f04e87cf362'
    });

    //our embedly key
    var embedlyKey = '680e3b4e813144b898e6f88bb4d9b145';

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

    //Get the title of a link (Using embedly)
    $scope.getTitle = function(theLink)
    {
        //Get the response from embedly
        $http.get("http://api.embed.ly/1/extract?key=" + embedlyKey + "&url=" + theLink)
        .then(function (response) {
            //Get the document
            var element = document.getElementById("linkTitle-" + theLink);

             element.innerHTML = response.data.title;
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
        //Used this
        //https://developers.soundcloud.com/docs/api/guide#playing

        SC.get('/resolve', { url: theLink}, function(track) {

            //Get the document
            var element = document.getElementById("scWidget-" + theLink);

            element.src = $sce.trustAsResourceUrl("https://w.soundcloud.com/player/?url=https%3A" +
            track.uri.substring(track.uri.indexOf("//api.soundcloud.com")) +
            "&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true");
        });
    }

    //Get a sce trusted embedly bandcamp
    $scope.getBandcamp = function(theLink)
    {
        //Get the response from embedly
        $http.get("http://api.embed.ly/1/extract?key=" + embedlyKey + "&url=" + theLink)
        .then(function (response) {
            //Our response from embedly
            //Get the document
            var element = document.getElementById("bandcamp-" + theLink);

             element.innerHTML = $sce.trustAsHtml(response.data.media.html);
        });
    }

    //Submit a dumped link
    $scope.submitLink = function ()
    {
        //First need to see if it is a valid url
        if($scope.linkForm.linkInput.$valid)
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
        //it is not a valid url
        else {
            //Materialize.toast("Please enter a valid URL!", 3000);
        }
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

                //Inform user
                Materialize.toast("Deleted " + dump.content + "!", 3000);
            }
        });
    }


  });
