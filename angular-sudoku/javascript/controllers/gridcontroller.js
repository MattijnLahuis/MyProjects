angular.module('sudoku')
	.controller('GridController', GridController);

GridController.$inject = ['$scope'];

function GridController($scope) {
	var vm = this;

	vm.setActive = setActive;
	vm.key = key;

	vm.gridLength = 630;
	vm.ctx = null;

	vm.cells = [];
	vm.activeX = null;
	vm.activeY = null;

	function init() {
		//init cells
		for(var x=0;x<9;x++) {
			var row = [];
			for(var y=0;y<9;y++) {
				row.push({
					value: 0
				});
			}
			vm.cells.push(row);
		}

		setUpCanvas();
		drawGrid();

		generateFullGrid();
	}

	function setUpCanvas() {
		vm.ctx = document.getElementById('gridCanvas').getContext('2d');
	}

	function drawGrid() {
		vm.ctx.strokeStyle = "green";
		vm.ctx.lineWidth="1";

		//surrounding gridx
		vm.ctx.beginPath();
		vm.ctx.moveTo(0,0);
		vm.ctx.lineTo(0,vm.gridLength);
		vm.ctx.stroke();

		vm.ctx.beginPath();
		vm.ctx.moveTo(0,vm.gridLength);
		vm.ctx.lineTo(vm.gridLength,vm.gridLength);
		vm.ctx.stroke();
		
		vm.ctx.beginPath();
		vm.ctx.moveTo(vm.gridLength,vm.gridLength);
		vm.ctx.lineTo(vm.gridLength,0);
		vm.ctx.stroke();
		
		vm.ctx.beginPath();
		vm.ctx.moveTo(vm.gridLength,0);
		vm.ctx.lineTo(0,0);
		vm.ctx.stroke();
		
		//vertical lines
		for(var i=1;i<9;i++) {
			vm.ctx.beginPath();
			i % 3 == 0 ? vm.ctx.lineWidth = 3 : vm.ctx.lineWidth = 1;
			vm.ctx.moveTo((vm.gridLength / 9) * i,0);
			vm.ctx.lineTo((vm.gridLength / 9) * i, vm.gridLength);
			vm.ctx.stroke();
		}

		//horizontal lines
		for(i=1;i<9;i++) {
			vm.ctx.beginPath();
			i % 3 == 0 ? vm.ctx.lineWidth = 3 : vm.ctx.lineWidth = 1;
			vm.ctx.moveTo(0,(vm.gridLength / 9) * i);
			vm.ctx.lineTo(vm.gridLength, (vm.gridLength / 9) * i);
			vm.ctx.stroke();
		}
	}

	function setActive(newX, newY) {
		vm.activeX = newX;
		vm.activeY = newY;
	}

	function key(e) {
		// console.log(e.which);

		//left
		if(e.which == 37) {
			e.preventDefault();
			vm.activeX--;
			if(vm.activeX < 0) {
				vm.activeX = 8;
			}
		//up
		} else if(e.which == 38) {
			e.preventDefault();
			vm.activeY--;
			if(vm.activeY < 0) {
				vm.activeY = 8;
			}
		//right
		} else if(e.which == 39) {
			e.preventDefault();
			vm.activeX++
			if(vm.activeX > 8) {
				vm.activeX = 0;
			}
		//down
		} else if(e.which == 40) {
			e.preventDefault();
			vm.activeY++;
			if(vm.activeY > 8) {
				vm.activeY = 0;
			}
		//1-9 regular || numpad
		} else if((e.which >= 49 && e.which <= 57) || (e.which >= 97 && e.which <= 105)) {
			vm.cells[vm.activeX][vm.activeY].value = e.which % 48;
		}
	}

	function generateFullGrid() {
		var valid = false;

		while(!valid) {
			valid = true;

			outer_loop:
			for(var x=0;x<9;x++) {
				for(var y=0;y<9;y++) {
					var values = [1,2,3,4,5,6,7,8,9];

					for(var a=x;a>=0;a--) {
						var val = vm.cells[a][y].value;

						if(values.indexOf(val) != -1) {
							values.splice(values.indexOf(val), 1);
						}
					}

					for(var b=y;b>=0;b--) {
						var val = vm.cells[x][b].value;

						if(values.indexOf(val) != -1) {
							values.splice(values.indexOf(val), 1);
						}
					}

					if(values.length < 1) {
						valid = false;
						break outer_loop;
					}

					vm.cells[x][y].value = values[Math.floor(Math.random() * values.length)];
				}
			}
		}
	}

	function numberOfSolutions(grid) {
		for(var x=0;x<9;x++) {
			for(var y=0;y<9;y++) {
				if(grid[x][y].value == 0) {
					for(var i=1;i<=9;i++) {
						if(getRow(grid,x).concat(getColumn(grid,y)).indexOf(i) != -1) {
							return 0;
						}

					}
				}
			}
		}
	}

	function getRow(grid, x) {
		var result = [];
		for(var y=0;y<9;y++) {
			result.push(grid[x][y].value);
		}
		return result;
	}

	function getColumn(grid, y) {
		var result = [];
		for(var x=0;x<9;x++) {
			result.push(grid[x][y].value);
		}
		return result;
	}

	function getBox(grid, x, y) {
		var xEnd = x - (x % 3) + 3;
		var yEnd = y - (y % 3) + 3;
		var result = [];

		for(var i = xEnd - 3;i<xEnd;i++) {
			for(var j = yEnd - 3;j<yEnd;j++) {
				result.push(grid[j][i].value);
			}
		}
		return result;
	}


	init();
}