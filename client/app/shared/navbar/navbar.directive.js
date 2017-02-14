'use strict';

module.exports = function () {
  return {
    scope: {
      title: '=',
    },
    restrict: 'A',

    //controller: 'NavbarCtrl' //in case we need it
    link: function (scope, elem, attrs) {
    },

    templateUrl: 'static/shared/navbar/navbar.tpl.html',
  };
};
