angular.module('templates', []).run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('/javascript/templates/grid.html',
    "<style>\r" +
    "\n" +
    "	.gridColumn {\r" +
    "\n" +
    "		width: {{ gridCtrl.gridSize / 9 }}px;\r" +
    "\n" +
    "		height: {{ gridCtrl.gridSize }}px;\r" +
    "\n" +
    "	}\r" +
    "\n" +
    "\r" +
    "\n" +
    "	.cell {\r" +
    "\n" +
    "		width: {{ gridCtrl.gridSize / 9 }}px;\r" +
    "\n" +
    "		height: {{ gridCtrl.gridSize / 9 }}px;\r" +
    "\n" +
    "		line-height: {{ gridCtrl.gridSize / 9 }}px;\r" +
    "\n" +
    "	}\r" +
    "\n" +
    "\r" +
    "\n" +
    "	.dimmed:after {\r" +
    "\n" +
    "		content: {{ gridCtrl.victoryMessage() }};\r" +
    "\n" +
    "		width: {{ gridCtrl.gridSize }}px;\r" +
    "\n" +
    "		height: {{ gridCtrl.gridSize }}px;\r" +
    "\n" +
    "		padding-top: {{ gridCtrl.gridSize / 2 }}px;\r" +
    "\n" +
    "	}\r" +
    "\n" +
    "</style>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div class=\"gameOptions\">\r" +
    "\n" +
    "	<form class=\"form-horizontal\">\r" +
    "\n" +
    "		<div class=\"form-group form-group-sm\">\r" +
    "\n" +
    "			<label class=\"col-sm-2 control-label\" for=\"emptyCells\"># of empty cells: </label>\r" +
    "\n" +
    "			<div class=\"col-sm-2\">\r" +
    "\n" +
    "	        	<input class=\"form-control\" type=\"text\" id=\"emptyCells\" ng-model=\"gridCtrl.options.emptyCells\">\r" +
    "\n" +
    "		    </div>\r" +
    "\n" +
    "		</div>\r" +
    "\n" +
    "		<div class=\"form-group form-group-sm\">\r" +
    "\n" +
    "			<label class=\"col-sm-2 control-label\" for=\"emptyCells\">Difficulty: </label>\r" +
    "\n" +
    "			<div class=\"col-sm-2\">\r" +
    "\n" +
    "				<select ng-options=\"diff.value as diff.name disable when diff.disabled for diff in gridCtrl.DIFFICULTIES\" ng-model=\"gridCtrl.options.difficulty\"></select>\r" +
    "\n" +
    "			</div>\r" +
    "\n" +
    "		</div>\r" +
    "\n" +
    "		<div class=\"form-group newButton\">\r" +
    "\n" +
    "			<button class=\"btn btn-primary\" ng-click=\"gridCtrl.newSudoku()\">Generate new Sudoku</button>\r" +
    "\n" +
    "		</div>\r" +
    "\n" +
    "	</form>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div class=\"gameGrid\" ng-class=\"{dimmed: gridCtrl.isSolved}\" data-victory-text=\"{{ gridCtrl.yourPersonalMessage }}\" tabindex=\"0\" ng-keydown=\"gridCtrl.key($event)\">\r" +
    "\n" +
    "	<div class=\"gridColumn\" ng-repeat=\"row in gridCtrl.grid\">\r" +
    "\n" +
    "		<div ng-repeat=\"cell in row\" \r" +
    "\n" +
    "				class=\"cell\" \r" +
    "\n" +
    "				ng-class=\"{activeCell: gridCtrl.activeX == $parent.$index && gridCtrl.activeY == $index}\" \r" +
    "\n" +
    "				ng-click=\"gridCtrl.activeX = $parent.$index; gridCtrl.activeY = $index;\">\r" +
    "\n" +
    "			<span ng-show=\"cell.value != 0\" ng-class=\"{invalidCellValue: gridCtrl.cellsEmpty == 0 && !cell.isValid}\">{{ cell.value }}</span>\r" +
    "\n" +
    "		</div>\r" +
    "\n" +
    "	</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "	<canvas id=\"gridCanvas\" width=\"1200\" height=\"1200\"></canvas>\r" +
    "\n" +
    "</div>"
  );

}]);
