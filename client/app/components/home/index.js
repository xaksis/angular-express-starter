'use strict';

module.exports = angular.module('app.home', [
    require('../../shared/navbar').name,
  ])
.directive('caloriousLogin', require('./calorious-login/calorious-login.directive'))
.controller('HomeCtrl', ['$scope', require('./home.ctrl')]);
