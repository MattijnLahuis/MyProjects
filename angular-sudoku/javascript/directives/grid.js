angular.module('sudoku')
	.directive('grid', function() {
		return {
			restrict: "E",
			controller: "GridController",
			controllerAs: "gridCtrl",
			bindToController: true,
			templateUrl: "javascript/templates/grid.html"
		}
	})