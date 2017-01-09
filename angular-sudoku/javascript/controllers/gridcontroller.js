angular.module('sudoku')
	.controller('GridController', GridController);

GridController.$inject = ['$scope', '$window'];

function GridController($scope, $window) {
	var vm = this;

	vm.setActive = setActive;
	vm.key = key;
	vm.newSudoku = newSudoku;

	vm.gridSize = 0;
	vm.ctx = null;

	vm.grid = [];
	vm.solvedGrid = [];
	vm.activeX = null;
	vm.activeY = null;

	vm.isSolved = false;
	vm.cellsEmpty = 0;
	vm.yourPersonalMessage = "";

	vm.DIFFICULTIES = [
		{name: "Very easy", value: 0},
		{name: "Easy", value: 1},
		{name: "Medium", value: 2, disabled: true},
		{name: "Hard", value: 3, disabled: true},
		{name: "Very hard", value: 4, disabled: true},
	];

	vm.options = {
		emptyCells: 50,
		difficulty: vm.DIFFICULTIES[1].value
	}

	function init() {
		setUpCanvas();
		drawGrid();

		vm.newSudoku();
	}

	function newSudoku() {
		vm.grid = generateFullGrid();
		vm.solvedGrid = angular.copy(vm.grid);
		vm.isSolved = false;
		vm.yourPersonalMessage = getVictoryMessage();
		// generateTestGrid();

		deleteCells(vm.options.emptyCells);
		// console.log(isSatisfactory(vm.grid));
		// console.log(numberOfSolutions(angular.copy(vm.grid)));
	}

	function setUpCanvas() {
		vm.ctx = document.getElementById('gridCanvas').getContext('2d');
	}

	function drawGrid() {
		vm.ctx.clearRect(0, 0, 1200, 1200);
		$window.innerHeight - 250 > $window.innerWidth ? vm.gridSize = $window.innerWidth : vm.gridSize = $window.innerHeight - 250;

		vm.ctx.strokeStyle = "green";
		vm.ctx.lineWidth="1";

		//surrounding gridx
		vm.ctx.beginPath();
		vm.ctx.moveTo(0,0);
		vm.ctx.lineTo(0,vm.gridSize);
		vm.ctx.stroke();

		vm.ctx.beginPath();
		vm.ctx.moveTo(0,vm.gridSize);
		vm.ctx.lineTo(vm.gridSize,vm.gridSize);
		vm.ctx.stroke();
		
		vm.ctx.beginPath();
		vm.ctx.moveTo(vm.gridSize,vm.gridSize);
		vm.ctx.lineTo(vm.gridSize,0);
		vm.ctx.stroke();
		
		vm.ctx.beginPath();
		vm.ctx.moveTo(vm.gridSize,0);
		vm.ctx.lineTo(0,0);
		vm.ctx.stroke();
		
		//vertical lines
		for(var i=1;i<9;i++) {
			vm.ctx.beginPath();
			i % 3 == 0 ? vm.ctx.lineWidth = 3 : vm.ctx.lineWidth = 1;
			vm.ctx.moveTo((vm.gridSize / 9) * i,0);
			vm.ctx.lineTo((vm.gridSize / 9) * i, vm.gridSize);
			vm.ctx.stroke();
		}

		//horizontal lines
		for(i=1;i<9;i++) {
			vm.ctx.beginPath();
			i % 3 == 0 ? vm.ctx.lineWidth = 3 : vm.ctx.lineWidth = 1;
			vm.ctx.moveTo(0,(vm.gridSize / 9) * i);
			vm.ctx.lineTo(vm.gridSize, (vm.gridSize / 9) * i);
			vm.ctx.stroke();
		}
	}

	function setActive(newX, newY) {
		vm.activeX = newX;
		vm.activeY = newY;
	}

	function key(e) {
		if(vm.isSolved) {
			return;
		}
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
		}

		if(vm.activeX !== null && vm.activeY !== null && !vm.grid[vm.activeX][vm.activeY].isGiven) {
			//1-9 regular || numpad
			if((e.which >= 48 && e.which <= 57) || (e.which >= 96 && e.which <= 105)) {
				vm.grid[vm.activeX][vm.activeY].value = e.which % 48;

				if(e.which % 48 === 0) {
					vm.cellsEmpty++;
				} else {
					vm.cellsEmpty--;
				}

				if(vm.cellsEmpty === 0) {
					var solved = true;
					for(var x=0;x<9;x++) {
						for(var y=0;y<9;y++) {
							if(vm.grid[x][y].value != vm.solvedGrid[x][y].value) {
								solved = false;
								vm.grid[x][y].isValid = false;
							} else {
								vm.grid[x][y].isValid = true;
							}
						}
					}
					vm.isSolved = solved;
				}
			}
		}
	}

	function generateFullGrid() {
		var valid = false;

		while(!valid) {
			valid = true;

			var grid = [];
			//init grid
			for(var x=0;x<9;x++) {
				var row = [];
				for(var y=0;y<9;y++) {
					row.push({
						value: 0,
						isGiven: true,
						isValid: true
					});
				}
				grid.push(row);
			}

			outer_loop:
			for(var x=0;x<9;x++) {
				for(var y=0;y<9;y++) {
					var values = [1,2,3,4,5,6,7,8,9];

					var invalid_values = getRow(grid, x).concat(getColumn(grid,y).concat(getBox(grid,x,y)));

					var valid_values = [];					
					for(var i=0;i<values.length;i++) {
						if(invalid_values.indexOf(values[i]) === -1) {
							valid_values.push(values[i]);
						}
					}

					if(valid_values.length < 1) {
						valid = false;
						break outer_loop;
					}

					grid[x][y].value = valid_values[Math.floor(Math.random() * valid_values.length)];
				}
			}
		}
		return grid;
	}

	function deleteCells(numberOfCells) {
		vm.cellsEmpty = numberOfCells;
		for(;numberOfCells>0;numberOfCells--) {
			randomX = Math.floor(Math.random() * 9);
			randomY = Math.floor(Math.random() * 9);

			var tmpGrid = angular.copy(vm.grid);
			tmpGrid[randomX][randomY].value = 0;
			tmpGrid[randomX][randomY].isGiven = false;

			if(isSatisfactory(tmpGrid) && numberOfSolutions(tmpGrid) === 1) {
				vm.grid = tmpGrid;
			} else {
				numberOfCells++;
			}
		}
	}

	function generateTestGrid() {
		for(var i=0;i<9;i++) {
			for(var j=1;j<9;j++) {
				vm.grid[i][j].value = 1 + ((i + j) % 9);
				vm.grid[i][j].value = 1 + i
			}
		}
	}

	function isSatisfactory(grid) {
		tmpGrid = angular.copy(grid);
		
		for(var x=0;x<9;x++) {
			for(var y=0;y<9;y++) {
				if(tmpGrid[x][y].value === 0) {
					tmpGrid[x][y].value = [1,2,3,4,5,6,7,8,9];
				}
			}
		}

		var tryAgain = true;
		var solved = false;

		//naked singles
		while(tryAgain) {
			tryAgain = false;
			solved = true;
			for(var x=0;x<9;x++) {
				for(var y=0;y<9;y++) {
					if(tmpGrid[x][y].value.constructor != Array) {
						var cellValue = tmpGrid[x][y].value;
						for(var x2=0;x2<9;x2++) {
							if(tmpGrid[x2][y].value.constructor === Array && tmpGrid[x2][y].value.indexOf(cellValue) != -1) {
								tmpGrid[x2][y].value.splice(tmpGrid[x2][y].value.indexOf(cellValue), 1);
								if(tmpGrid[x2][y].value.length === 1) {
									tmpGrid[x2][y].value = tmpGrid[x2][y].value[0];
								}
								tryAgain = true;
							}
						}	
						for(var y2=0;y2<9;y2++) {
							if(tmpGrid[x][y2].value.constructor === Array && tmpGrid[x][y2].value.indexOf(cellValue) != -1) {
								tmpGrid[x][y2].value.splice(tmpGrid[x][y2].value.indexOf(cellValue), 1);
								if(tmpGrid[x][y2].value.length === 1) {
									tmpGrid[x][y2].value = tmpGrid[x][y2].value[0];
								}
								tryAgain = true;
							}
						}
						var i2 = x - (x % 3) + 3;
						var j2 = y - (y % 3) + 3;

						for(var i = i2-3;i < i2;i++) {
							for(var j = j2-3;j<j2;j++) {
								if(tmpGrid[i][j].value.constructor === Array && tmpGrid[i][j].value.indexOf(cellValue) != -1) {
									tmpGrid[i][j].value.splice(tmpGrid[i][j].value.indexOf(cellValue), 1);
									if(tmpGrid[i][j].value.length === 1) {
										tmpGrid[i][j].value = tmpGrid[i][j].value[0];
									}
								tryAgain = true;
								}
							}
						}
					}
				}
			}

			//hidden single, only for Easy and higher difficulties
			if(vm.options.difficulty > 0) {
				for(var x=0;x<9;x++) {
					for(var y=0;y<9;y++) {
						if(tmpGrid[x][y].value.constructor === Array) {
							var cellValue = tmpGrid[x][y].value;
							for(var i=0;i<tmpGrid[x][y].value.length;i++) {
								var numberFound = false;
								cellValue = tmpGrid[x][y].value[i];
								for(var x2=0;x2<9;x2++) {
									if(x2 !== x && tmpGrid[x2][y].value.constructor === Array && tmpGrid[x2][y].value.indexOf(cellValue) != -1) {
										numberFound = true;
										break;
									}
								}
								if(numberFound) {
									numberFound = false;
									for(var y2=0;y2<9;y2++) {
										if(y2 !== y && tmpGrid[x][y2].value.constructor === Array && tmpGrid[x][y2].value.indexOf(cellValue) != -1) {
											numberFound = true;
											break;
										}
									}
								}
								if(numberFound) {
									numberFound = false;
									var i2 = x - (x % 3) + 3;
									var j2 = y - (y % 3) + 3;

									outer_loop:
									for(var k = i2-3;k < i2;k++) {
										for(var j = j2-3;j<j2;j++) {
											if(k !== x && j !== y && tmpGrid[k][j].value.constructor === Array && tmpGrid[k][j].value.indexOf(cellValue) != -1) {
												numberFound = true;
												break outer_loop;
											}
										}
									}
								}
								if(!numberFound) {
									tmpGrid[x][y].value = cellValue;
									break;
								} else {
									solved = false;
								}
							}
						}
					}
				}
			}
		}
		return solved;
	} 

	function numberOfSolutions(grid) {
		var solutions = 0;
		for(var x=0;x<9;x++) {
			for(var y=0;y<9;y++) {
				if(grid[x][y].value === 0) {
					for(var i=1;i<=9;i++) {
						if(getRow(grid,x).concat(getColumn(grid,y)).concat(getBox(grid,x,y)).indexOf(i) == -1) {
							var newGrid = angular.copy(grid);
							newGrid[x][y].value = i;
							solutions += numberOfSolutions(newGrid);
						}
					}
					return solutions;
				}
			}
		}
		return 1 + solutions;
	}

	function getRow(grid, x) {
		var result = [];
		for(var y=0;y<9;y++) {
			if(grid[x][y].value > 0) {
				result.push(grid[x][y].value);	
			}
		}
		return result;
	}

	function getColumn(grid, y) {
		var result = [];
		for(var x=0;x<9;x++) {
			if(grid[x][y].value > 0) {
				result.push(grid[x][y].value);	
			}
		}
		return result;
	}

	function getBox(grid, x, y) {
		var xEnd = x - (x % 3) + 3;
		var yEnd = y - (y % 3) + 3;
		var result = [];

		for(var i = xEnd - 3;i<xEnd;i++) {
			for(var j = yEnd - 3;j<yEnd;j++) {
				if(grid[i][j].value > 0) {
					result.push(grid[i][j].value);	
				}
			}
		}
		return result;
	}

	function getVictoryMessage() {
		var messages = [
			"You are the best!",
			"Great job, friend.",
			"Amazing.",
			"Congratulations!",
			"such solve wow very impress"
		]
		var message = messages[Math.floor(Math.random() * messages.length)];
		return message;
	}

	$window.onresize = function() {
		drawGrid();
		$scope.$digest();
	}

	init();
}