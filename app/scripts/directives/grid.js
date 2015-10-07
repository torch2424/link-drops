'use strict';

/**
 * @ngdoc directive
 * @name linkDumpApp.directive:grid
 * @description
 * # grid
 From: http://microblog.anthonyestebe.com/2013-12-14/grid-pinterest-like-with-angular/
 */
angular.module('linkDumpApp')
  .directive('grid', function () {
      return {
          restrict: 'E',
          replace: true,
          //Need to create our own html file here
          //And copy pasta logic from old controller
          templateUrl: '../views/linkcard.html',
          scope: { list: '=' },
          controller: function ($scope, $element, $attrs, $http, $sce) {

              //Code for retrieving info of the dump

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

              //Get a sce trusted noembed
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
                  element.src = $sce.trustAsResourceUrl(url);

                  // say the dump has been lazy loaded
                  dump.lazyEmbed = true;
              }


              //Tiling code from the wonderful lor Anthony Estebe. Thank you so much
              //http://microblog.anthonyestebe.com/2013-12-14/grid-pinterest-like-with-angular/
              var _margin, _width, elemHeight, elemPerLine, elemWidth, gridWidth, margin, parent, width;
              parent = $element.parent()[0];
              _margin = null;
              _width = null;
              margin = function () {
                  return _margin || (_margin = parseInt($attrs.margin, 10) || 15);
              };
              width = function () {
                  return _width || (_width = parseInt($attrs.width, 10) || 225);
              };
              elemWidth = function () {
                  return width() + 2 * margin();
              };
              elemHeight = function (height) {
                  return height + 2 * margin();
              };
              elemPerLine = function () {
                  return parseInt(parent.offsetWidth / elemWidth(), 10);
              };
              gridWidth = function () {
                  return elemPerLine() * elemWidth();
              };
              return $scope.computePositions = function () {
                  var bottom, bottoms, elem, height, i, index, j, k, left, len, len1, maxHeight, ref, top;
                  bottoms = function () {
                      var j, ref, results;
                      results = [];
                      for (i = j = 0, ref = elemPerLine(); 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
                          results.push(0);
                      }
                      return results;
                  }();
                  maxHeight = 0;
                  ref = $element.children();
                  for (i = j = 0, len = ref.length; j < len; i = ++j) {
                      elem = ref[i];
                      elem.style.height = $scope.list[i].height + 'px';
                      top = null;
                      index = 0;
                      for (i = k = 0, len1 = bottoms.length; k < len1; i = ++k) {
                          bottom = bottoms[i];
                          if (!(top == null || top > bottom)) {
                              continue;
                          }
                          top = bottom;
                          index = i;
                      }
                      left = index * elemWidth() % gridWidth() + margin();
                      height = top + elemHeight(elem.offsetHeight);
                      if (maxHeight < height) {
                          maxHeight = height;
                      }
                      bottoms[index] = height;
                      elem.style.left = left + 'px';
                      elem.style.top = top + margin() + 'px';
                      elem.style.width = width() + 'px';
                  }
                  return {
                      width: gridWidth() + 'px',
                      height: maxHeight + 'px'
                  };
              };
          }
      };
  });
