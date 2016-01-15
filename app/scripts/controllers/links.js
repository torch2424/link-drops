'use strict';

/**
 * @ngdoc function
 * @name linkDumpApp.controller:LinksCtrl
 * @description
 * # LinksCtrl
 * Controller of the linkDumpApp
 */
angular.module('linkDumpApp')
  .controller('LinksCtrl', function($scope, $sce, $cookies, $timeout,
      Dumps, Dump, Labels, Label, $location, $http, $mdToast) {

    //Get our sessions token
    var sessionToken = $cookies.get("sessionToken");

    //inititalizes our dumps
    $scope.dumps = [];

    //Inititalize searching
    $scope.findInput = false;

    //Initialize soundcloud
    SC.initialize({
      client_id: 'b9513e908ef7793171225f04e87cf362'
    });

    //Our main scraper will be noembed, since it is free and open soruce
    //With embedly as a backup to keep costs low
    //our embedly key

    //To get the correct things to fire the in viewport, wait a second and then scroll to the top
    $timeout(function() {
      if (window.scrollY == 0 && window.scrollX == 0) {
        window.scrollTo(0, 1);
      }
    }, 2000);

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
            $mdToast.show(
              $mdToast.simple()
                .content(err.data.msg)
                .position('top right')
                .hideDelay(3000)
            );
          }
        }
      );
    }

    //Get the title of a link
    $scope.getTitle = function(dump, index) {

      //Get the response from noembed
      $http.get("https://dev.kondeo.com/api/title-scraper.php?q=" + dump.content)
        .then(function(response) {

          //Get the document
          var element = document.getElementById("linkTitle-" + index);

          //Make sure the element isnt null and we got the object
          if(element != null)
          {
              element.innerHTML = response.data.title;
          }
        });
    }

    //Get a sce trusted noembed
    $scope.getEmbed = function(dump) {
      //Get the response from noembed
      $http.get("https://noembed.com/embed?url=" + dump.content + "&nowrap=on")
        .then(function(response) {

          //Check for no error
          if (!response.data.error) {
            //Get the document
            var element = document.getElementById("embed-" + dump.content);

            if(element != null) {
                element.innerHTML = $sce.trustAsHtml(response.data.html);
            }

            // say the dump has been lazy loaded
            dump.lazyEmbed = true;
          }
        });
    }

    //Embed an image link
    $scope.getImage = function(dump) {

        //pass through the function
        elemUrl("img", dump);
    }

    //Embed a Kickstarter thing
    $scope.getKickStarter = function(dump) {

        //Get the embed url
        var kickUrl = dump.content.split("?")[0] + "/widget/card.html?v=2";

        //pass through the function
        elemUrl("kick", dump, kickUrl);
    }

    //Embed a vine thing
    $scope.getVine = function(dump) {

        //Get the embed url
        var vineUrl = dump.content+ "/embed/simple";

        //pass through the function
        elemUrl("vine", dump, vineUrl);
    }

    //Embed a spotify (artist, albulm, track) thing
    $scope.getSpotify = function(dump) {

        //Get the spotify link type and id , last 2 out of 5 elemnts
        var splitUrl = dump.content.split("/");

        //pass through the function
        elemUrl("spotify", dump,
        "https://embed.spotify.com/?uri=spotify:"
        + splitUrl[3] + ":" +splitUrl[4].split("?")[0]);
    }

    //get a sce trusted soundcloud thingy
    $scope.getSoundCloud = function(dump) {
      //Used this
      //https://developers.soundcloud.com/docs/api/guide#playing

      SC.get('/resolve', {
        url: dump.content
      }, function(track) {

          //pass through the function
          elemUrl("scWidget", dump,
      "https://w.soundcloud.com/player/?url=https%3A" +
        track.uri.substring(track.uri.indexOf("//api.soundcloud.com")) +
        "&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true");

      });
    }

    function elemUrl(id, dump, url) {
        //Get the document
        var element = document.getElementById( id + "-" + dump.content);

        if(!url) {
            url = dump.content;
        }

        //Set the element src
        if(element != null)
        {
            element.src = $sce.trustAsResourceUrl(url);
        }

        // say the dump has been lazy loaded
        dump.lazyEmbed = true;
    }

    //Check if a link already exists
    function linkExists() {
      for (var i = 0; i < $scope.dumps.length; i++) {
        if ($scope.dumps[i].content == $scope.enteredLink) {
            $mdToast.show(
              $mdToast.simple()
                .content('Link already exists!')
                .position('top right')
                .hideDelay(3000)
            );

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
                $mdToast.show(
                  $mdToast.simple()
                    .content('Dropped!')
                    .position('top right')
                    .hideDelay(3000)
                );

                //Add new dump to dump array
                $scope.dumps.unshift(data);
              },
              function(err) {
                  $mdToast.show(
                    $mdToast.simple()
                      .content(err.data.msg)
                      .position('top right')
                      .hideDelay(3000)
                  );
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

      //Splice off dump we dont want
      var index = $scope.dumps.indexOf(dump);
      $scope.dumps.splice(index, 1);

      //Save the link
      Dump.delete(remJson, function(data, status) {
        //Inform user
        $mdToast.show(
          $mdToast.simple()
            .content("Deleted " + data.content + "!")
            .position('top right')
            .hideDelay(3000)
        );

      }, function(err) {
          $mdToast.show(
            $mdToast.simple()
              .content(err.data.msg)
              .position('top right')
              .hideDelay(3000)
          );
      });;
    }

    //Submit a dumped link
    $scope.submitLabel = function(dump) {
      var payload = {
        "token": sessionToken,
        "link": dump.content,
        "title": dump.newLabel
      }
      Labels.save(payload, function(data) {
        var index = $scope.dumps.indexOf(dump);
        $scope.dumps[index].labels.push(data);
        dump.newLabel = "";
      }, function(err) {
          $mdToast.show(
            $mdToast.simple()
              .content(err.data.msg)
              .position('top right')
              .hideDelay(3000)
          );
      });
    }

    $scope.filterLabel = function(label){
        $scope.enteredFind = label.title;
        $scope.findInput = true;
    }

    $scope.removeLabel = function(dump, label) {
      var payload = {
        "token": sessionToken,
        "dumpId": dump._id,
        "id": label._id
      }
      Label.delete(payload, function(data) {
        var i1 = $scope.dumps.indexOf(dump);
        var i2 = $scope.dumps[i1].labels.indexOf(label);
        $scope.dumps[i1].labels.splice(i2, 1);
      }, function(err) {
          $mdToast.show(
            $mdToast.simple()
              .content(err.data.msg)
              .position('top right')
              .hideDelay(3000)
          );
      });
    }
  });
