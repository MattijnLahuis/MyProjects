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
		{name: "Medium", value: 2},
		{name: "Hard", value: 3, disabled: true},
		{name: "Very hard", value: 4, disabled: true},
	];

	vm.options = {
		emptyCells: 50,
		difficulty: vm.DIFFICULTIES[2].value
	}

	function init() {
		_setUpCanvas();
		_drawGrid();

		newSudoku();
	}

	function newSudoku() {
		vm.grid = _generateFullGrid();
		vm.solvedGrid = angular.copy(vm.grid);
		vm.isSolved = false;
		vm.yourPersonalMessage = _getVictoryMessage();

		_deleteCells(vm.options.emptyCells);
	}

	function _setUpCanvas() {
		vm.ctx = document.getElementById('gridCanvas').getContext('2d');
	}

	function _drawGrid() {
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
			} else if(e.which == 8 || e.which == 46) {
				vm.grid[vm.activeX][vm.activeY].value = 0;
				vm.cellsEmpty++;
			}
		}
	}

	function _generateFullGrid() {
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

					var invalid_values = _getRow(grid, x).concat(_getColumn(grid,y).concat(_getBox(grid,x,y)));

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

	function _deleteCells(numberOfCells) {
		vm.cellsEmpty = numberOfCells;

		var cells = [];
		for(var i=0;i<81;i++) {
			cells.push(i);
		}

		while(numberOfCells > 0 && cells.length > 0) {
			var random = cells[Math.floor(Math.random() * cells.length)];
			cells.splice(cells.indexOf(random), 1);

			var x = Math.floor(random / 9);
			var y = random % 9;

			var prevValue = vm.grid[x][y].value;

			vm.grid[x][y].value = 0;
			vm.grid[x][y].isGiven = false;

			if(_isSatisfactory(vm.grid) && _numberOfSolutions(vm.grid) === 1) {
				numberOfCells--;
			} else {
				vm.grid[x][y].value = prevValue;
				vm.grid[x][y].isGiven = true;
			}
		}
	}

	function _isSatisfactory(grid) {
		var tmpGrid = angular.copy(grid);

		//naked singles
		for(var x=0;x<9;x++) {
			for(var y=0;y<9;y++) {
				if(tmpGrid[x][y].value === 0) {
					tmpGrid[x][y].value = [];
					for(var i=1;i<10;i++) {
						if(_getRow(tmpGrid,x).concat(_getColumn(tmpGrid,y)).concat(_getBox(tmpGrid,x,y)).indexOf(i) == -1) {
							tmpGrid[x][y].value.push(i);
						}
					}
				}
			}
		}

		var tryAgain = true;
		var solved = false;

		while(tryAgain) {
			tryAgain = false;
			solved = true;
			for(var x=0;x<9;x++) {
				for(var y=0;y<9;y++) {
					if(tmpGrid[x][y].value.constructor == Array && tmpGrid[x][y].value.length == 1) {
						tmpGrid[x][y].value = tmpGrid[x][y].value[0];
						tryAgain = true;
					}
				}
			}

			//hidden single, only for Easy and higher difficulties
			if(vm.options.difficulty > 0) {
				for(var x=0;x<9;x++) {
					for(var y=0;y<9;y++) {
						if(tmpGrid[x][y].value.constructor === Array) {
							for(var i=0;i<tmpGrid[x][y].value.length;i++) {
								var numberFound = false;
								var cellValue = tmpGrid[x][y].value[i];
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

			//naked pair/triplet/quad, only for >medium difficulty
			if(vm.options.difficulty > 1) {
				for(var x=0;x<9;x++) {
					for(var y=0;y<9;y++) {
						if(tmpGrid[x][y].value.constructor === Array && tmpGrid[x][y].value.length > 1 && tmpGrid[x][y].value.length < 3) {
							var matches = [];
							for(var x2=0;x2<9;x2++) {
								if(tmpGrid[x2][y].value.constructor === Array && tmpGrid[x2][y].value.sort().join() === tmpGrid[x][y].value.sort().join()) {
									matches.push(x2);
								}
							}

							if(matches.length == tmpGrid[x][y].value.length) {
								for(var x2=0;x2<9;x2++) {
									if(matches.indexOf(x2) == -1 && tmpGrid[x2][y].value.constructor === Array) {
										for(var i=0;i<tmpGrid[x][y].value.length;i++) {
											tmpGrid[x2][y].value.splice(tmpGrid[x2][y].value.indexOf(tmpGrid[x][y].value[i]), 1);
											tryAgain = true;
										}
									}
								}
							} else {
								matches = [];
								for(var y2=0;y2<9;y2++) {
									if(tmpGrid[x][y2].value.constructor === Array && tmpGrid[x][y2].value.sort().join() === tmpGrid[x][y].value.sort().join()) {
										matches.push(y2);
									}
								}

								if(matches.length == tmpGrid[x][y].value.length) {
									for(var y2=0;y2<9;y2++) {
										if(matches.indexOf(y2) == -1 && tmpGrid[x][y2].value.constructor === Array) {
											for(var i=0;i<tmpGrid[x][y].value.length;i++) {
												tmpGrid[x][y2].value.splice(tmpGrid[x][y2].value.indexOf(tmpGrid[x][y].value[i]), 1);
												tryAgain = true;
											}
										}
									}
								} else {
									matches = [];
									var i2 = x - (x % 3) + 3;
									var j2 = y - (y % 3) + 3;

									for(var k = i2-3;k < i2;k++) {
										for(var j = j2-3;j<j2;j++) {
											if(tmpGrid[k][j].value.constructor === Array && tmpGrid[k][j].value.sort().join() === tmpGrid[x][y].value.sort().join()) {
												matches.push([k,j]);
											}
										}
									}

									if(matches.length == tmpGrid[x][y].value.length) {
										for(var k = i2-3;k < i2;k++) {
											for(var j = j2-3;j<j2;j++) {
												if(matches.indexOf([k,j]) == -1 && tmpGrid[k][j].value.constructor === Array) {
													for(var i=0;i<tmpGrid[x][y].value.length;i++) {
														tmpGrid[k][j].value.splice(tmpGrid[k][j].value.indexOf(tmpGrid[x][y].value[i]), 1);
														tryAgain = true;
													}
												}
											}
										}
									}
								}

							}
						}
					}
				}
			}
		}
		return solved;
	}



	function _numberOfSolutions(grid) {
		var solutions = 0;
		for(var x=0;x<9;x++) {
			for(var y=0;y<9;y++) {
				if(grid[x][y].value === 0) {
					for(var i=1;i<=9;i++) {
						if(_getRow(grid,x).concat(_getColumn(grid,y)).concat(_getBox(grid,x,y)).indexOf(i) == -1) {
							var newGrid = angular.copy(grid);
							newGrid[x][y].value = i;
							solutions += _numberOfSolutions(newGrid);
						}
					}
					return solutions;
				}
			}
		}
		return 1 + solutions;
	}

	function _getRow(grid, x) {
		var result = [];
		for(var y=0;y<9;y++) {
			if(grid[x][y].value > 0) {
				result.push(grid[x][y].value);	
			}
		}
		return result;
	}

	function _getColumn(grid, y) {
		var result = [];
		for(var x=0;x<9;x++) {
			if(grid[x][y].value > 0) {
				result.push(grid[x][y].value);	
			}
		}
		return result;
	}

	function _getBox(grid, x, y) {
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

	function _getVictoryMessage() {
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

	function printGrid(grid) {
		var gridToString = "";
		for(var x=0;x<9;x++) {
			for(var y=0;y<9;y++) {
				if(grid[x][y].value > 0) {
					gridToString += grid[x][y].value;
				} else {
					gridToString += " ";
				}
				if(y != 8) {
					gridToString += " ";
				}
				if([2,5].indexOf(y) != -1) {
					gridToString += " ";
				}
			}
			gridToString += "\n";
			if([2,5].indexOf(x) != -1) {
				gridToString += "\n";
			}
		}
		console.log(gridToString);
	}

	$window.onresize = function() {
		_drawGrid();
		$scope.$digest();
	}

	init();
}