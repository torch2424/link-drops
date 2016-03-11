'use strict';

/**
 * @ngdoc service
 * @name linkDumpApp.Embedder
 * @description
 * # Embedder
 * Service in the linkDumpApp.
 */
angular.module('linkDumpApp')
  .service('Embedder', function ($timeout, $sce,
        $http, Gridify) {

      //Initialize our embedQueue
      var embeds = [];

      //Array of supported embeds
      var supportedEmbed = [
          "noembed",
          "image",
          "soundcloud",
          "kickstarter",
          "vine",
          "spotify"
      ];

      //Initialize soundcloud
      SC.initialize({
        client_id: 'b9513e908ef7793171225f04e87cf362'
      });

      //Our grid refresh timeout
      var refreshTimeout = 100;

      //Function to verify if a dump is embbedable
      //First param is the dump
      //If dump is embeddable, dump.embed will be a string of embed type
      //Else it will be false
      var isEmbeddable = function(dump) {

          //Check for all of the different types of embeds
          if((dump.content.indexOf('https://www.youtube.com/watch?v=') > -1)
              || (dump.content.indexOf('http://www.amazon.com/') > -1)
              || (dump.content.indexOf('https://www.amazon.com/') > -1)
              || (dump.content.indexOf('https://instagram.com/p/') > -1)
              || (dump.content.indexOf('wikipedia.org/wiki/') > -1)
              || (dump.content.indexOf('https://vimeo.com/') > -1)
              || (dump.content.indexOf('https://twitter.com/') > -1
              && dump.content.indexOf('/status/') > -1)
              || (dump.content.indexOf('https://gist.github.com/') > -1)) {
                  dump.embed = supportedEmbed[0];
          }
          else if((dump.content.indexOf('.jpg') > -1)
              || (dump.content.indexOf('.png') > -1)
              || (dump.content.indexOf('.gif') > -1)) {
                  dump.embed = supportedEmbed[1];
          }
          else if((dump.content.indexOf('https://soundcloud.com/') > -1)) {
              dump.embed = supportedEmbed[2];
          }
          else if((dump.content.indexOf('https://www.kickstarter.com/projects/') > -1)) {
              dump.embed = supportedEmbed[3];
          }
          else if((dump.content.indexOf('https://vine.co/v/') > -1)) {
              dump.embed = supportedEmbed[4];
          }
          else if((dump.content.indexOf('https://play.spotify.com/') > -1)
              || (dump.content.indexOf('https://open.spotify.com/') > -1)) {
              dump.embed = supportedEmbed[5];
          }
          else {
              dump.embed = false;
          }

          //Now return the modified dump
          return dump;
      }

      //Continutation of is embeddable function, and will execute the embed
      var doEmbed = function(dump) {

          if(dump.embed == supportedEmbed[0]) return embedderFunctions.noEmbed(dump);
          else if(dump.embed == supportedEmbed[1]) return embedderFunctions.imageEmbed(dump);
          else if(dump.embed == supportedEmbed[2]) return embedderFunctions.soundCloudEmbed(dump);
          else if(dump.embed == supportedEmbed[3]) return embedderFunctions.kickStarterEmbed(dump);
          else if(dump.embed == supportedEmbed[4]) return embedderFunctions.vineEmbed(dump);
          else if(dump.embed == supportedEmbed[5]) return embedderFunctions.spotifyEmbed(dump);

          //Don't Remove the dump from the embed queue,
          //That way we are not double embedding

          //Not refreshing here, since we do not want to race the embed
      }

      //Function to assign embed divs to ids
      var srcUrl = function(id, dump, url) {

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

          //Also, refresh our grid
          //Timeout since we need to apply our new html
          $timeout(function () {
              Gridify.refreshGrid();
          }, refreshTimeout);

          //Return the dump
          return dump;
      }

      var embedderFunctions = {

          //Function to return our supported embeds
          supported: supportedEmbed,

          //Function that will timeout our mouseover
          //And allow embedding by hovering link
          lazyEmbed: function(dump) {

              //Check if the dump is already in the array
              for(var i = 0; i < embeds.length; i++) {
                  if(dump._id == embeds[i].embed._id) {
                      return dump;
                  }
              }

              //Check if we are embeddable, if dump.embed is undefined
              if(dump.embed == undefined) dump = isEmbeddable(dump);

              //Check if we've already embedded
              if(dump.lazyEmbed ||
              !dump.embed) return dump;


              //Else, Add the dump to the embed queue
              //$timout will return a cancellable promise
              embeds.push({
                  'embed': dump,
                  'timeout': $timeout(function() {

                          //Check if we are still moused over,
                          //if we are, embed!
                          if(!dump.lazyEmbed &&
                          dump.embed) {

                              //Finally embed the dump
                              return doEmbed(dump);
                          }
                      }, 1250)
              });

              //Start the timeout

              return dump;
          },

          cancelEmbed: function(dump) {

              //First check if we were an embeddable link in then
              //first place
              if(!dump.embed) return;

              //First search for the embed to cancel
              for(var i = 0; i < embeds.length; i++) {
                  if(dump._id == embeds[i].embed._id) {

                      //Cancel the embed timeout
                      $timeout.cancel(embeds[i].timeout);

                      //Now remove from the array
                      embeds.splice(i, 1);
                      return true;
                  }
              }

              //Return false since we couldnt cancel
              return false;
          },

          //No embed
          noEmbed : function(dump) {

            //Get the response from noembed
            $http.get("https://noembed.com/embed?url=" + dump.content + "&nowrap=on")
              .then(function(response) {

                //Check for no error
                if (!response.data.error) {

                    //Cannot use srcUrl since it embeds by URL and not HTML

                      //Get the document
                      var element = document.getElementById("embed-" + dump.content);

                      if(element != null) {
                          element.innerHTML = $sce.trustAsHtml(response.data.html);
                      }

                      // say the dump has been lazy loaded
                      dump.lazyEmbed = true;

                      //Also, refresh our grid
                      //Timeout since we need to apply our new html
                      $timeout(function () {
                          Gridify.refreshGrid();
                      }, refreshTimeout);

                      //Return the dump
                      return dump;
                }
                //Error
                else {
                    console.log("No Embed Error!, response: " + JSON.stringify(response));

                    //Make the embed error
                    dump.embed = "error";
                    return dump;
                }

              });
          },

          //Image embeds
          imageEmbed: function(dump) {

              //Simply pass through the sourcing
              return srcUrl("img", dump)
          },

          kickStarterEmbed: function(dump) {

              //Get the embed url
              var kickUrl = dump.content.split("?")[0] + "/widget/card.html?v=2";

              //pass through the function
              return srcUrl("kick", dump, kickUrl);
          },

          vineEmbed: function(dump) {

              //Get the embed url
              var vineUrl = dump.content+ "/embed/simple";

              //pass through the function
              return srcUrl("vine", dump, vineUrl);
          },

          spotifyEmbed: function(dump) {

              //Get the spotify link type and id , last 2 out of 5 elemnts
              var splitUrl = dump.content.split("/");

              //pass through the function
              return srcUrl("spotify", dump,
              "https://embed.spotify.com/?uri=spotify:"
              + splitUrl[3] + ":" +splitUrl[4].split("?")[0]);
          },

          soundCloudEmbed: function(dump) {
            //Used this
            //https://developers.soundcloud.com/docs/api/guide#playing

            SC.get('/resolve', {
              url: dump.content
            }, function(track) {

                //pass through the function
                return srcUrl("scWidget", dump,
                "https://w.soundcloud.com/player/?url=https%3A" +
                track.uri.substring(track.uri.indexOf("//api.soundcloud.com")) +
                "&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true");

            });
          }
      }

      //Simply return the embedder functions
      //To the outside world
      return embedderFunctions;
  });
