'use strict';

module.exports = angular.module('app.dashboard', [
    require('../../shared/navbar').name,
  ])
  .controller('DashboardCtrl', ['$scope', require('./dashboard.ctrl')]);
