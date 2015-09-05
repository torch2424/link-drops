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

    //Inititalize searching
    $scope.findInput = false;

    //Initialize soundcloud
    SC.initialize({
        client_id: 'b9513e908ef7793171225f04e87cf362'
    });

    //our embedly key
    var embedlyKey = '680e3b4e813144b898e6f88bb4d9b145';

    //To get the correct things to fire the in viewport, wait a second and then scroll to the top
    $timeout(function() {
        if(window.scrollY == 0 && window.scrollX == 0)
        {
            window.scrollTo(0, 1);
        }
    }, 2000);

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

    //Show the find input
    $scope.showFind = function() {
        if($scope.findInput) {
            $scope.findInput = false;
            $scope.enteredFind = "";
        }
        else {
            $scope.findInput = true;
        }
    }

    //Get the title of a link (Using embedly)
    $scope.getTitle = function(index)
    {
        //Get the index in the order that we need it
        index = $scope.dumps.length - index - 1;

        //Get the response from embedly
        $http.get("http://api.embed.ly/1/extract?key=" + embedlyKey + "&url=" + $scope.dumps[index].content)
        .then(function (response) {
            //Get the document
            var element = document.getElementById("linkTitle-" + $scope.dumps[index].content);

             element.innerHTML = response.data.title;

             //set the title attribute of the dump
             $scope.dumps[index].title = response.data.title;

             //say we lazy loaded it
             $scope.dumps[index].lazyTitle = true;
        });
    }

    //Get a sce trusted iframe youtube link
    $scope.getYoutubeFrame = function(index)
    {

        //Get the index in the order that we need it
        index = $scope.dumps.length - index - 1;

        //Get the document
        var element = document.getElementById("youtube-" + $scope.dumps[index].content);

        //Get the link on the 33 substring, and trust it
        element.src = $sce.trustAsResourceUrl("https://www.youtube.com/embed/" + $scope.dumps[index].content.split("https://www.youtube.com/watch?v=")[1]);

        // say the dump has been lazy loaded
        $scope.dumps[index].lazyEmbed = true;
    }

    //Get a sce trusted iframe vimeo link
    $scope.getVimeoFrame = function(index)
    {

        //Get the index in the order that we need it
        index = $scope.dumps.length - index - 1;

        //Get the document
        var element = document.getElementById("vimeo-" + $scope.dumps[index].content);

        //Get the link on the 33 substring, and trust it
        element.src = $sce.trustAsResourceUrl("https://player.vimeo.com/video/" + $scope.dumps[index].content.split("https://vimeo.com/")[1] + "?color=ffffff&title=0&portrait=0&badge=0");

        // say the dump has been lazy loaded
        $scope.dumps[index].lazyEmbed = true;
    }

    //get a sce trusted soundcloud thingy
    $scope.getSoundCloud = function(index)
    {
        //Used this
        //https://developers.soundcloud.com/docs/api/guide#playing

        //Get the index in the order that we need it
        index = $scope.dumps.length - index - 1;

        SC.get('/resolve', { url: $scope.dumps[index].content}, function(track) {

            //Get the document
            var element = document.getElementById("scWidget-" + $scope.dumps[index].content);

            element.src = $sce.trustAsResourceUrl("https://w.soundcloud.com/player/?url=https%3A" +
            track.uri.substring(track.uri.indexOf("//api.soundcloud.com")) +
            "&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true");

            // say the dump has been lazy loaded
            $scope.dumps[index].lazyEmbed = true;

        });
    }

    //Get a sce trusted embedly bandcamp
    $scope.getBandcamp = function(index)
    {
        //Get the index in the order that we need it
        index = $scope.dumps.length - index - 1;


        //Get the response from embedly
        $http.get("http://api.embed.ly/1/extract?key=" + embedlyKey + "&url=" + $scope.dumps[index].content)
        .then(function (response) {
            //Our response from embedly
            //Get the document
            var element = document.getElementById("bandcamp-" + $scope.dumps[index].content);

             element.innerHTML = $sce.trustAsHtml(response.data.media.html);

             // say the dump has been lazy loaded
             $scope.dumps[index].lazyEmbed = true;
        });
    }

    //Check if a link already exists
    function linkExists() {
        for(var i = 0; i < $scope.dumps.length; i++)
        {
            if($scope.dumps[i].content == $scope.enteredLink)
            {
                Materialize.toast("Link already exists!", 3000);

                //Set the input back to empty
                $scope.enteredLink = "";

                return true;
            }
        }

        return false;
    }

    //Submit a dumped link
    $scope.submitLink = function ()
    {
        //First need to see if it is a valid url
        if($scope.linkForm.linkInput.$valid)
        {
            //Need to set a slight timeout for ng paste
            $timeout(function () {
                //Also check if the link already exists
                if(!linkExists())
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
                }
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
