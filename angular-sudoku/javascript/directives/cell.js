angular.module('sudoku')
	.directive('cell', function() {
		return {
			restrict: "E",
			controller: 'CellController',
			controllerAs: 'cellCtrl',
			scope: {
				x: '@',
				y: '@',
				gridLength: '@'
			},
			templateUrl: 'javascript/templates/cell.html'
		}
	})