'use strict';

/**
 * @ngdoc service
 * @name linkDumpApp.Embedder
 * @description
 * # Embedder
 * Service in the linkDumpApp.
 */
angular.module('linkDumpApp')
  .service('Embedder', function ($timeout, $sce, $http) {
			var embedded = null;
			var visible = false;

			var styling = {
				mode: "full",
				backdrop: {},
				container: {}
			}

      //Array of supported embeds
      var supportedEmbed = [
          "noembed",
          "image",
          "soundcloud",
          "kickstarter",
          "vine",
          "spotify",
					"general"
      ];

      //Initialize soundcloud
      SC.initialize({
        client_id: 'b9513e908ef7793171225f04e87cf362'
      });

			var setStyling = function(mode){
				switch(mode){
					case "full":
						styling.container = {
							transition: "none",
							position: "fixed",
							right: "20%",
							left: "20%",
							top: "200px",
							textAlign: "center",
							paddingTop: "15px",
							backgroundColor: "#eeeeee",
							zIndex: 20
						}
						styling.backdrop = {
							position: "fixed",
							left: 0,
							right: 0,
							bottom: 0,
							top: 0,
							backgroundColor: "rgba(0,0,0,0.45)",
							zIndex: 19
						}
						styling.embed = {}
						break;
					case "small":
						styling.container = {
							transition: "none",
							position: "fixed",
							right: "2%",
							left: "70%",
							bottom: "2%",
							textAlign: "center",
							paddingTop: "15px",
							backgroundColor: "#eeeeee",
							zIndex: 20
						}
						styling.backdrop = {
							display: "none"
						}
						styling.embed = {}
						break;
					case "min":
						styling.container = {
							transition: "none",
							position: "fixed",
							right: "2%",
							left: "70%",
							bottom: "2%",
							textAlign: "center",
							paddingTop: "15px",
							backgroundColor: "#eeeeee",
							zIndex: 20
						}
						styling.backdrop = {
							display: "none"
						}
						styling.embed = {
							visibility: "hidden",
					    height: 0
						}
						break;
				}
				styling.mode = mode;
			}
			setStyling("full");

      //Function to verify if a dump is embbedable
      //First param is the dump
      //If dump is embeddable, dump.embed will be a string of embed type
      //Else it will be false
      var getEmbedType = function(dump) {

          //Check for all of the different types of embeds
          if((dump.content.indexOf('https://www.youtube.com/watch?v=') > -1)
              || (dump.content.indexOf('http://www.amazon.com/') > -1)
              || (dump.content.indexOf('https://www.amazon.com/') > -1)
              || (dump.content.indexOf('https://instagram.com/p/') > -1)
              || (dump.content.indexOf('wikipedia.org/wiki/') > -1)
              || (dump.content.indexOf('https://vimeo.com/') > -1)
							|| (dump.content.indexOf('flickr.com/photos') > -1)
              || (dump.content.indexOf('https://twitter.com/') > -1
              && dump.content.indexOf('/status/') > -1)
              || (dump.content.indexOf('https://gist.github.com/') > -1)) {
                  return supportedEmbed[0];
          }
          else if((dump.content.indexOf('.jpg') > -1)
              || (dump.content.indexOf('.png') > -1)
              || (dump.content.indexOf('.gif') > -1)) {
                  return supportedEmbed[1];
          }
          else if((dump.content.indexOf('https://soundcloud.com/') > -1)) {
              return supportedEmbed[2];
          }
          else if((dump.content.indexOf('https://www.kickstarter.com/projects/') > -1)) {
              return supportedEmbed[3];
          }
          else if((dump.content.indexOf('https://vine.co/v/') > -1)) {
              return supportedEmbed[4];
          }
          else if((dump.content.indexOf('https://play.spotify.com/') > -1)
              || (dump.content.indexOf('https://open.spotify.com/') > -1)) {
              return supportedEmbed[5];
          }
          else {
              return false;
          }
      }

      //Continutation of is embeddable function, and will execute the embed
      var doEmbed = function(dump) {
          if(dump.embedType == supportedEmbed[0]) return embedderFunctions.noEmbed(dump);
          else if(dump.embedType == supportedEmbed[1]) return embedderFunctions.imageEmbed(dump);
          else if(dump.embedType == supportedEmbed[2]) return embedderFunctions.soundCloudEmbed(dump);
          else if(dump.embedType == supportedEmbed[3]) return embedderFunctions.kickStarterEmbed(dump);
          else if(dump.embedType == supportedEmbed[4]) return embedderFunctions.vineEmbed(dump);
          else if(dump.embedType == supportedEmbed[5]) return embedderFunctions.spotifyEmbed(dump);
					else if(dump.embedType == supportedEmbed[6]) return embedderFunctions.generalEmbed(dump);
      }

			var embedderFunctions = {
				//No embed
				noEmbed : function(dump, callback) {

					//Get the response from noembed
					$http.get("https://noembed.com/embed?url=" + dump.content + "&nowrap=on")
						.then(function(response) {

							//Check for no error
							if (!response.data.error) {

										dump.embedHtml = $sce.trustAsHtml(response.data.html);

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

						dump.embedSrc = $sce.trustAsResourceUrl(dump.content);
				},

				kickStarterEmbed: function(dump) {

						//Get the embed url
						var kickUrl = dump.content.split("?")[0] + "/widget/card.html?v=2";

						dump.embedSrc = $sce.trustAsResourceUrl(kickUrl);
				},

				vineEmbed: function(dump) {

						//Get the embed url
						var vineUrl = dump.content+ "/embed/simple";

						dump.embedSrc = $sce.trustAsResourceUrl(vineUrl);
				},

				spotifyEmbed: function(dump) {

						//Get the spotify link type and id , last 2 out of 5 elemnts
						var splitUrl = dump.content.split("/");

						dump.embedSrc = $sce.trustAsResourceUrl("https://embed.spotify.com/?uri=spotify:" + splitUrl[3] + ":" +splitUrl[4].split("?")[0]);
				},

				generalEmbed: function(dump) {

						var generalUrl = dump.content;

						dump.embedSrc = $sce.trustAsResourceUrl(generalUrl);
				},

				soundCloudEmbed: function(dump) {
					//Used this
					//https://developers.soundcloud.com/docs/api/guide#playing

					SC.get('/resolve', {
						url: dump.content
					}, function(track) {
							$timeout(function(){
									dump.embedSrc = $sce.trustAsResourceUrl("https://w.soundcloud.com/player/?url=https%3A" +
										track.uri.substring(track.uri.indexOf("//api.soundcloud.com")) +
										"&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true");
							},0);
					});
				}
			}

      var service = {

          //Function to return our supported embeds
          supported: supportedEmbed,

					isEmbeddable: function(dump){
							var canEmbed = getEmbedType(dump) ? true : false;
							return canEmbed;
					},

					getVisible: function(){
						  return visible;
					},

					getEmbed: function(){
							return embedded;
					},

					getStyle: function(){
							return styling;
					},

					maximize: function(){
							setStyling("full");
					},

					smallsize: function(){
							setStyling("small");
					},

					minimize: function(){
							setStyling("min");
					},

          //Function that will timeout our mouseover
          //And allow embedding by hovering link
          open: function(dump) {

              //Check if we are embeddable, if dump.embed is undefined
              if(dump.embedType == undefined) dump.embedType = getEmbedType(dump);

              doEmbed(dump);

							visible = true;
							embedded = dump;

							return dump;

          },

          close: function(dump) {
						  visible = false;
							embedded = null;
          }
      }

      //Simply return the embedder functions
      //To the outside world
      return service;
  });
