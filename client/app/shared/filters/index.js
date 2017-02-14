'use strict';

module.exports = angular.module('sbApp.filters', [])
.filter('capitalizeFirst', function() {
	return function(input, scope) {
		if (input){
	    	input = input.toLowerCase();
	    	return input.substring(0,1).toUpperCase()+input.substring(1);
		}
	}
})
.filter('percentage', ['$filter', function ($filter) {
  return function (input, decimals) {
    return $filter('number')(input * 100, decimals) + '%';
  };
}])
.filter('percentageParenthesis', ['$filter', function ($filter) {
  return function (input, decimals) {
  	var formatted = $filter('number')(Math.abs(input) * 100, decimals) + '%'
  	if (input < 0){
  		formatted = '(' + formatted + ')';
  	}
    return  formatted;
  };
}])
.filter('abbreviateCurrency', ['$filter', function ($filter) {
	return function (input) {
		var format = d3.format('.3s');
		var value = format(input);
		value = value.replace('G', 'B');
		return '$' + value;
	};
}])
.filter('percentageNA', ['$filter', function ($filter) {
	return function (input, decimals) {
		if (input == 'N/A') {
			return input;
		}
		return $filter('number')(input * 100, decimals) + '%';
	};
}])
.filter('tableFilter', ['$filter', function ($filter) {
	return function (input, type) {
		function abbreviateCurrency(value){
			var format = d3.format('.3s');
			return (function (v){
				return v.replace('G', 'B');
			})(format(value));
		}
		if (type == 'currency'){
			return '$' + abbreviateCurrency(input);
		}
		else if (type == 'percentage' && input != 'N/A'){
			return $filter('number')(input * 100, 2) + '%';
		}
		else if (type == 'number'){
			// return $filter('number')(input, 0)
			return abbreviateCurrency(input);
		}
		return input;
	};
}]);