'use strict';
//var angular = require('angular');
require('angular-sanitize');
//require('angular-animate');
require('angular-ui-router');
//require('angular-material');

angular.module('app',
[
  'ui.router',
  'ngSanitize',
  'ngAnimate',
  'ngMaterial',
  require('./components/dashboard').name,
  require('./components/home').name,
  require('./shared/filters').name,
])
.config(
  [
    '$stateProvider',
    '$urlRouterProvider',
    '$interpolateProvider',
    '$mdThemingProvider',
    function (
      $stateProvider,
      $urlRouterProvider,
      $interpolateProvider,
      $mdThemingProvider) {

      $stateProvider
        .state('home', {
          url: '',
          templateUrl: '/static/components/home/home.tpl.html',
          controller: 'HomeCtrl',
        })
        .state('dashboard', {
          url: '/dashboard',
          templateUrl: '/static/components/dashboard/dashboard.tpl.html',
          controller: 'DashboardCtrl',
        });

      //theme here
      $mdThemingProvider.definePalette('caloriousPalette',
      {
        50: 'F2F7FC',
        100: 'CDDBEC',
        200: 'A4BEDF',
        300: '799DCD',
        400: '5284C6',
        500: '396FB4',
        600: '3568AA',
        700: '2D5FA0',
        800: '225394',
        900: '143F78',
        A100: 'FCDB6F',
        A200: 'FCCB24',
        A400: 'F8B602',
        A700: 'EFA10F',
        contrastDefaultColor: 'light',    // whether, by default, text (contrast)
        // on this palette should be dark or light

        contrastDarkColors: ['50', '100', //hues which contrast should be 'dark' by default
         '200', '300', '400', 'A100',],
        contrastLightColors: undefined,    // could also specify this if default was 'dark'
      });

      $mdThemingProvider.theme('default')
        .primaryPalette('caloriousPalette');
    },
]);
