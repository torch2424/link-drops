'use strict';

/**
 * @ngdoc function
 * @name linkDumpApp.controller:LinksCtrl
 * @description
 * # LinksCtrl
 * Controller of the linkDumpApp
 */
angular.module('linkDumpApp')
  .controller('LinksCtrl', function($scope, $sce, $cookies, $timeout, Dumps, Dump, Labels, $location, $http) {

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
        function(err) {
          if (err.status == 401) {
            //Session is invalid! Redirect.
            $location.path("/");
          } else {
            //Something else happened
            Materialize.toast(err.data.msg, 3000);
          }
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
    $scope.getTitle = function(dump, index) {

      //Get the response from noembed
      $http.get("http://dev.kondeo.com/api/title-scraper.php?q=" + dump.content)
        .then(function(response) {

            //Get the document
            var element = document.getElementById("linkTitle-" + index);

            element.innerHTML = response.data.title;
        });
    }

    //Get a sce trusted embedly bandcamp
    $scope.getEmbed = function(dump) {
      //Get the response from noembed
      $http.get("https://noembed.com/embed?url=" + dump.content + "&nowrap=on")
        .then(function(response) {

          //Check for no error
          if (!response.data.error) {
            //Get the document
            var element = document.getElementById("embed-" + dump.content);

            element.innerHTML = $sce.trustAsHtml(response.data.html);
            // say the dump has been lazy loaded
            dump.lazyEmbed = true;
          } else {
            //Get the response from embedly
            $http.get("http://api.embed.ly/1/oembed?key=" + embedlyKey + "&url=" + dump.content)
              .then(function(response) {
                //Our response from embedly
                //Get the document
                var element = document.getElementById("embed-" + dump.content);

                element.innerHTML = $sce.trustAsHtml(response.data.html);
                // say the dump has been lazy loaded
                dump.lazyEmbed = true;
              });
          }
        });
    }

    //get a sce trusted soundcloud thingy
    $scope.getSoundCloud = function(dump) {
      //Used this
      //https://developers.soundcloud.com/docs/api/guide#playing

      SC.get('/resolve', {
        url: dump.content
      }, function(track) {

        //Get the document
        var element = document.getElementById("scWidget-" + dump.content);

        element.src = $sce.trustAsResourceUrl("https://w.soundcloud.com/player/?url=https%3A" +
          track.uri.substring(track.uri.indexOf("//api.soundcloud.com")) +
          "&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true");

        // say the dump has been lazy loaded
        dump.lazyEmbed = true;

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
                Materialize.toast("Dropped!", 3000);

                //Add new dump to dump array
                $scope.dumps.unshift(data);
              },
              function(err) {
                Materialize.toast(err.data.msg, 3000);
              });
          }
        }, 1);
      }
      //it is not a valid url
      else {
        //Toast here the error
      }
    }

    //Submit a dumped link
    $scope.submitLabel = function(dump) {
        var data = {
            "token": sessionToken,
            "link": dump.content,
            "title": dump.newLabel
        }
        Labels.save(data, function(){
            var index = $scope.dumps.indexOf(dump);
            $scope.dumps[index].labels.push(data);
        }, function(err){
            Materialize.toast(err.data.msg, 3000);
        });
    }

    //Remove a dumped link
    $scope.removeLink = function(dump) {
      //Our json we will submit to the backend
      var remJson = {
        "token": sessionToken,
        "id": dump._id
      };

      var index = $scope.dumps.indexOf(dump);

      //Save the link
      Dump.delete(remJson, function(data, status) {
        //Splice off dump we dont want
        $scope.dumps.splice(index, 1);

        //Inform user
        Materialize.toast("Deleted " + data.content + "!", 3000);

      }, function(err) {
        Materialize.toast(err.data.msg, 3000);
      });;
    }


  });
