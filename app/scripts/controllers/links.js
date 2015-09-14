'use strict';

/**
 * @ngdoc function
 * @name linkDumpApp.controller:LinksCtrl
 * @description
 * # LinksCtrl
 * Controller of the linkDumpApp
 */
angular.module('linkDumpApp')
  .controller('LinksCtrl', function($scope, $sce, $cookies, $timeout, Dumps, Dump, $location, $http) {

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

    //Our main scraper will be noembed, since it is free and open soruce
    //With embedly as a backup to keep costs low
    //our embedly key
    var embedlyKey = '1ac8190e5c2940a99a5ffde29e389e72';

    //To get the correct things to fire the in viewport, wait a second and then scroll to the top
    $timeout(function() {
      if (window.scrollY == 0 && window.scrollX == 0) {
        window.scrollTo(0, 1);
      }
    }, 2000);

    //get our dumps
    $scope.getDumps = function() {
      //Our json we will submit to the backend
      var dumpJson = {
        "token": sessionToken,
      };

      Dumps.get(dumpJson,
        function(data, status) {
          $scope.dumps = data;
        },
        function(data, status) {
          Materialize.toast(data.msg, 3000);
        }
      );
    }

    //Show the find input
    $scope.showFind = function() {
      if ($scope.findInput) {
        $scope.findInput = false;
        $scope.enteredFind = "";
      } else {
        $scope.findInput = true;

        //To get the correct things to fire the in viewport, wait a second and then scroll to the top
        $timeout(function() {
          if (window.scrollY == 0 && window.scrollX == 0) {
            //focus on the field
            document.getElementById('findInput').focus();
          }
        }, 300);
      }
    }

    //Get the title of a link
    $scope.getTitle = function(index) {
      //Get the index in the order that we need it
      index = $scope.dumps.length - index - 1;

      //Get the response from noembed
      $http.get("https://noembed.com/embed?url=" + $scope.dumps[index].content)
        .then(function(response) {

          //Check for no error
          if (!response.data.error) {
            //Get the document
            var element = document.getElementById("linkTitle-" + $scope.dumps[index].content);

            element.innerHTML = response.data.title;

            //set the title attribute of the dump
            $scope.dumps[index].title = response.data.title;
          } else {
            //Get the title from embedly
            $http.get("http://api.embed.ly/1/extract?key=" + embedlyKey + "&url=" + $scope.dumps[index].content)
              .then(function(response) {
                //Our response from embedly
                //Get the document
                var element = document.getElementById("linkTitle-" + $scope.dumps[index].content);

                element.innerHTML = response.data.title;

                //set the title attribute of the dump
                $scope.dumps[index].title = response.data.title;
              });
          }

        });
    }

    //Get a sce trusted embedly bandcamp
    $scope.getEmbed = function(index) {
      //Get the index in the order that we need it
      index = $scope.dumps.length - index - 1;

      //Get the response from noembed
      $http.get("https://noembed.com/embed?url=" + $scope.dumps[index].content + "&nowrap=on")
        .then(function(response) {

          //Check for no error
          if (!response.data.error) {
            //Get the document
            var element = document.getElementById("embed-" + $scope.dumps[index].content);

            element.innerHTML = $sce.trustAsHtml(response.data.html);
            // say the dump has been lazy loaded
            $scope.dumps[index].lazyEmbed = true;
          } else {
            //Get the response from embedly
            $http.get("http://api.embed.ly/1/oembed?key=" + embedlyKey + "&url=" + $scope.dumps[index].content)
              .then(function(response) {
                //Our response from embedly
                //Get the document
                var element = document.getElementById("embed-" + $scope.dumps[index].content);

                element.innerHTML = $sce.trustAsHtml(response.data.html);
                // say the dump has been lazy loaded
                $scope.dumps[index].lazyEmbed = true;
              });
          }
        });
    }

    //get a sce trusted soundcloud thingy
    $scope.getSoundCloud = function(index) {
      //Used this
      //https://developers.soundcloud.com/docs/api/guide#playing

      //Get the index in the order that we need it
      index = $scope.dumps.length - index - 1;

      SC.get('/resolve', {
        url: $scope.dumps[index].content
      }, function(track) {

        //Get the document
        var element = document.getElementById("scWidget-" + $scope.dumps[index].content);

        element.src = $sce.trustAsResourceUrl("https://w.soundcloud.com/player/?url=https%3A" +
          track.uri.substring(track.uri.indexOf("//api.soundcloud.com")) +
          "&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true");

        // say the dump has been lazy loaded
        $scope.dumps[index].lazyEmbed = true;

      });
    }

    //Check if a link already exists
    function linkExists() {
      for (var i = 0; i < $scope.dumps.length; i++) {
        if ($scope.dumps[i].content == $scope.enteredLink) {
          Materialize.toast("Link already exists!", 3000);

          //Set the input back to empty
          $scope.enteredLink = "";

          return true;
        }
      }

      return false;
    }

    //Submit a dumped link
    $scope.submitLink = function() {
      //First need to see if it is a valid url
      if ($scope.linkForm.linkInput.$valid) {
        //Need to set a slight timeout for ng paste
        $timeout(function() {
          //Also check if the link already exists
          if (!linkExists()) {
            //Our json we will submit to the backend
            var enterJson = {
              "token": sessionToken,
              "content": $scope.enteredLink
            };

            //Save the link
            Dumps.save(enterJson,
              function(data, status) {
                //Set enetered link back to null
                $scope.enteredLink = "";

                //Inform user of the dump
                Materialize.toast("Dumped!", 3000);

                //Re-get all ouf our links!
                $scope.getDumps();
              },
              function(data, status) {
                Materialize.toast(data.msg, 3000);
              });
          }
        }, 1);
      }
      //it is not a valid url
      else {
        //Toast here the error
      }
    }

    //Remove a dumped link
    $scope.removeLink = function(dump) {
      //Our json we will submit to the backend
      var remJson = {
        "token": sessionToken,
        "id": dump._id
      };

      //Save the link
      Dump.delete(remJson, function(data, status) {
        //Re-get all ouf our links!
        $scope.getDumps();

        //Inform user
        Materialize.toast("Deleted " + data.content + "!", 3000);

      }, function(data, status) {
        Materialize.toast(data.msg, 3000);
      });;
    }


  });
