'use strict';

/**
 * @ngdoc overview
 * @name linkDumpApp
 * @description
 * # linkDumpApp
 *
 * Main module of the application.
 */
angular
  .module('linkDumpApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'favicon',
    'angular-inview',
    'envConfig',
    'ngMaterial',
    'angularGrid'
  ])
  .config(function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl',
        controllerAs: 'signUp'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .when('/dumps', {
        templateUrl: 'views/links.html',
        controller: 'LinksCtrl',
        controllerAs: 'links'
      })
      .when('/myaccount', {
        templateUrl: 'views/myaccount.html',
        controller: 'MyaccountCtrl',
        controllerAs: 'myAccount'
      })
      .when('/forgot/:token', {
        templateUrl: 'views/forgot.html',
        controller: 'ForgotCtrl',
        controllerAs: 'forgot'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
