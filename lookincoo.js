(function(window, angular) {
	'use strict';

	window.lookinCoo = angular.module('lookinCoo', []);

	window.lookinCoo.controller('LookinCoo', ['$scope', '$location','$anchorScroll', function($scope, $location, $anchorScroll) {
		$scope.lines = [];
		$scope.type_character_time_in_ms = 30;

		var initial_lines = angular.fromJson(window.localStorage.getItem('code')),
			lines_left = initial_lines.slice(0), // clone
			type_character_interval = null,
			current_line = '',
			line_number = 0,
			current_character = 0;

		function complete_line() {
			$scope.$apply(function () {
				$scope.lines.push({number: line_number++, content: current_line});
				current_line = $scope.current_text = '';
				$location.hash('line' + (line_number - 1));
				$anchorScroll();
			});

			window.clearInterval(type_character_interval);

			type_next_line();
		}

		function type_next_character() {
			$scope.$apply(function () {
				$scope.current_text += current_line[current_character++];
			});

			if(current_line.length < current_character) {
				complete_line();
			}
		}

		function type_next_line() {

			if(lines_left.length === 0) {
				lines_left = initial_lines.slice(0);
			}

			current_line = lines_left.shift();
			current_character = 0;
			type_character_interval = window.setInterval(type_next_character, $scope.type_character_time_in_ms);
		}

		$scope.stop = function() {
			$scope.stopped = true;
			window.clearInterval(type_character_interval);
		};

		$scope.start = function() {
			$scope.stopped = false;
			current_line = $scope.current_text = '';
			current_character = 0;

			type_next_line();
		}

		$scope.current_text = '';
		type_next_line();
	}]);

})(window, window.angular);
