'use strict';
const { PerformanceObserver, performance } = require('perf_hooks');
var fs = require("fs");
const { exec } = require('child_process');
//let initialPuzzle = "....15.9...3...4...893.461.39..6..87.2.....3....4.3...4..1.7..9..1...8..7..5.83.1"
//let solution = "246815793173926458589374612394261587625789134817453926458137269931642875762598341"
var initialPuzzle = "...25..8...8.7.1...6.....9....8139..8.24.9..5.1.........4...7...317.2.4.5.7...836"
var solution = "793251684248976153165348297456813972872469315319527468984635721631782549527194836"
//let initialTotals = [0,30000,10000,10000,10000,10000,10000]
var difficulty = 'medium'
let maxUsed = 165 //dont let stock get below 35
var needed1 = 10 // increase to require more depletions
var needed2 = 20 // increase to require more depletions
var sumNeeded = 299 // increase to require more depletions
var initialTotal = 200
let initialTotals = [0,initialTotal,initialTotal,initialTotal,initialTotal,initialTotal,initialTotal]
var nMade = 0
fs.writeFileSync("../games/"+difficulty+"Raw.txt", "", function (err) {
	if (err){
		console.log(err);
	}
});
var currentPuzzle = [[[0]]]
var buttonNumbers = [0]
var itemTotals = [0]
var itemSpends = [0]
var itemGets = [0]
var itemPerThing = [[0]]
var spendPerThing = [[0]]
var spendPerPerson = [0]
var nPeople = 0
var nYear = 0
var stopSudoku = true
var minTotals = [0]
var whereNumbers = [[[0]]]
var addedNumbers = [0,0,0,0,0,0,0,0,0,0]
var currentSolution = [[[0]]]
var elapsedTime = 0;
var possibleRows = {};
function toCSS(somepuzzle) {
	var csspuzzle = [[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0]]
	for (var iiii=0;iiii<9;iiii++) {
		for (var ii=0;ii<9;ii++) {
			let blockrow = Math.floor(iiii/3)
			let blockcol = Math.floor(ii/3)
			let blockindex = (iiii%3)*3+(ii%3)
			csspuzzle[iiii][ii] = somepuzzle[blockrow][blockcol][blockindex]
		}
	}
	return csspuzzle
			
}
function toCSSep(somepuzzle) {
	var existingPlots = [0,0,0,0,0,0,0,0,0];
	for (var iiii=0;iiii<9;iiii++) {
		for (var ii=0;ii<9;ii++) {
			let blockrow = Math.floor(iiii/3)
			let blockcol = Math.floor(ii/3)
			let blockindex = (iiii%3)*3+(ii%3)
			if (somepuzzle[blockrow][blockcol][blockindex] > 0) {
				existingPlots[somepuzzle[blockrow][blockcol][blockindex]-1]+=1
			}
		}
	}
	return existingPlots
			
}
function toCSSmp(somepuzzle) {
	var maxPlots = [9,9,9,9,9,9,9,9,9];
	for (var iiii=0;iiii<9;iiii++) {
		for (var ii=0;ii<9;ii++) {
			let blockrow = Math.floor(iiii/3)
			let blockcol = Math.floor(ii/3)
			let blockindex = (iiii%3)*3+(ii%3)
			if (somepuzzle[blockrow][blockcol][blockindex] > 0) {
				maxPlots[somepuzzle[blockrow][blockcol][blockindex]-1]-=1
			}
		}
	}
	return maxPlots
			
}
			
function convertPuzzle() {
	let oldPuzzle = initialPuzzle.replace(/\./g,'0')
	var puzzle = [[[],[],[]],[[],[],[]],[[],[],[]]]
	var solvedPuzzle = [[[],[],[]],[[],[],[]],[[],[],[]]]
	whereNumbers = [[],[],[],[],[],[],[],[],[]]
	possibleRows = {1:[0,1,2,3,4,5,6,7,8],2:[0,1,2,3,4,5,6,7,8],3:[0,1,2,3,4,5,6,7,8],4:[0,1,2,3,4,5,6,7,8],5:[0,1,2,3,4,5,6,7,8],6:[0,1,2,3,4,5,6,7,8],7:[0,1,2,3,4,5,6,7,8],8:[0,1,2,3,4,5,6,7,8],9:[0,1,2,3,4,5,6,7,8]};
	for (var iiii=0;iiii<3;iiii++) {
		for (var iii=0;iii<3;iii++) {
			for (var ii=0;ii<3;ii++) {
				for (var i=0;i<3;i++) {
					let index = i+9*ii+3*iii+27*iiii
					var piece = oldPuzzle[index]
					if (piece > 0){
						for( var arri = 0; arri < possibleRows[piece].length; arri++){ 
							if ( possibleRows[piece][arri] === iiii) { 
								possibleRows[piece].splice(arri, 1); break;
							}
						}
					}
					puzzle[iiii][iii].push(piece)
					var blankSpace = false
					if (piece == 0) {
						blankSpace = true
					}
					piece = solution[index]
					solvedPuzzle[iiii][iii].push(piece)
					if (blankSpace) {
						whereNumbers[piece-1].push([iiii,iii,ii*3+i])
					}
				}
			}
		}
	}
	currentSolution = []
	for (var iiii=0;iiii<3;iiii++) {
		currentSolution.push([]);
		for (var iii=0;iii<3;iii++) {
			currentSolution[iiii].push(solvedPuzzle[iiii][iii].slice());
			
		}
	}
	for (var i=1;i<10;i++) {
		if (addedNumbers[i] > 0) {
			for (var ii=0;ii<addedNumbers[i];ii++) {
				if (whereNumbers[i-1].length > 2) {
					let randIndex = Math.floor(Math.random() * whereNumbers[i-1].length)
					puzzle[whereNumbers[i-1][randIndex][0]][whereNumbers[i-1][randIndex][1]][whereNumbers[i-1][randIndex][2]] = i
					whereNumbers[i-1].splice(randIndex,1)
				}
			}
		}
	}
	
	return puzzle //array of array of array of ints
}


function updateBN() {
	for (var i=0;i<9;i++) {
		buttonNumbers[i]=0
		for (var ii=0;ii<3;ii++) {
			for (var iii=0;iii<3;iii++) {
				for (var iiii=0;iiii<9;iiii++) {
					if (currentPuzzle[ii][iii][iiii] == i+1) {
						buttonNumbers[currentPuzzle[ii][iii][iiii]-1]+=1
					}
				}
			}
		}
	}
}

function resetPuzzle() {
	currentPuzzle = convertPuzzle()
	buttonNumbers = [2,2,2,2,2,2,2,2,2]
	itemTotals = initialTotals.slice()
	itemSpends = [0,0,0,0,0,0,0]
	itemGets = [0,0,0,0,0,0,0]
	itemPerThing = [[0,0,0,0,0,0,0,0,0],[21,16,3,0,0,10,30,15,6],[0,0,0,30,0,0,0,0,0],[0,0,0,0,0,3,0,15,24],[10,10,10,0,0,0,0,0,0],[0,0,0,0,15,2,0,0,0],[5,0,13,0,0,0,0,0,0]]
	spendPerThing = [[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[1,1,1,0,0,0,5,5,5],[20,10,10,0,0,0,0,0,0],[0,0,0,0,0,0,10,10,10],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0]]
	spendPerPerson = [0,30,3,0,0,5,5]
	updateBN()
	nYear = 0
	for (var i=0;i<9;i++) {
		nYear+=buttonNumbers[i]
	}
	nPeople = Math.floor(nYear/3)
	stopSudoku = true
	minTotals = itemTotals.slice()
}


function updateSG() {
	for (var i=0;i<7;i++) {
		itemSpends[i]=spendPerPerson[i]*nPeople
		itemGets[i]=0
		for (var ii=0;ii<9;ii++) {
			itemSpends[i]+=buttonNumbers[ii]*spendPerThing[i][ii]
			itemGets[i]+=buttonNumbers[ii]*itemPerThing[i][ii]
		}
	}
} 
function updatePop() {
	if (nYear%3 == 0) {
		nPeople+=1
	}
	nYear+=1
}
/*
function fitSpot(puzzle, row, col, block, num) {
	if (puzzle[Math.floor(block/3)][block%3][3*(row%3)+col%3] != 0) {
		return false
	}
	for (var ii=0;ii<9;ii++) {
		if (puzzle[Math.floor(row/3)][Math.floor(ii/3)][ii%3+3*(row%3)] == num) {
			return false
		}
	}
	for (var ii=0;ii<9;ii++) {
		if (puzzle[Math.floor(ii/3)][Math.floor(col/3)][3*(ii%3)+col%3] == num) {
			return false
		}
	}
	for (var ii=0;ii<9;ii++) {
		if (puzzle[Math.floor(block/3)][block%3][ii] == num) {
			return false
		}
	}
	return true
}

function checkRow(puzzle){
	var startTime = performance.now();
	var allPlays = []
	for (var num=1;num<10;num++){
		for (var rowi in possibleRows[num]) {
			var row = possibleRows[num][rowi];
			var numSpots = -1
			for (var i=0;i<9;i++) {
				if (fitSpot(puzzle, row, i, Math.floor(i/3)+3*Math.floor(row/3), num)) {
					if (numSpots == -1) {
						numSpots = i
					}
					else {
						numSpots = -1
						break
					}
				}
			}
			if (numSpots != -1) {
				allPlays.push([num,Math.floor( (Math.floor(numSpots/3)+3*Math.floor(row/3))/3 ),(Math.floor(numSpots/3)+3*Math.floor(row/3))%3,3*(row%3)+numSpots%3])
			}
		}
	}
	elapsedTime += performance.now()-startTime;
	return allPlays
}

function checkColumn(puzzle) {
	var allPlays = []
	for (var num=1;num<10;num++){
		for (var col=0;col<9;col++) {
			var numSpots = -1
			for (var i=0;i<9;i++) {
				if (fitSpot(puzzle, i, col, Math.floor(col/3)+3*Math.floor(i/3), num)) {
					if (numSpots == -1) {
						numSpots = i
					}
					else {
						numSpots = -1
						break
					}
				}
			}
			if (numSpots != -1) {
				allPlays.push([num,Math.floor( (Math.floor(col/3)+3*Math.floor(numSpots/3))/3 ),(Math.floor(col/3)+3*Math.floor(numSpots/3))%3,3*(numSpots%3)+col%3])
			}
		}
	}
	return allPlays
}

function checkBlock(puzzle){
	var allPlays = []
	for (var num=1;num<10;num++){
		for (var block=0;block<9;block++) {
			var numSpots = -1
			for (var i=0;i<9;i++) {
				if (fitSpot(puzzle, 3*Math.floor(block/3)+Math.floor(i/3), 3*(block%3)+i%3, block, num)) {
					if (numSpots == -1) {
						numSpots = i
					}
					else {
						numSpots = -1
						break
					}
				}
			}
			if (numSpots != -1) {
				allPlays.push([num,Math.floor((block)/3),(block)%3,3*((3*Math.floor(block/3)+Math.floor(numSpots/3))%3)+(3*(block%3)+numSpots%3)%3])
			}
		}
	}
	return allPlays
}
*/
function fitSpotBasic(puzzle, row, col, block, num) {
	if (puzzle[Math.floor(block/3)][block%3][3*(row%3)+col%3] != 0) {
		return false
	}
	for (var ii=0;ii<9;ii++) {
		if (puzzle[Math.floor(row/3)][Math.floor(ii/3)][ii%3+3*(row%3)] == num) {
			return false
		}
	}
	for (var ii=0;ii<9;ii++) {
		if (puzzle[Math.floor(ii/3)][Math.floor(col/3)][3*(ii%3)+col%3] == num) {
			return false
		}
	}
	for (var ii=0;ii<9;ii++) {
		if (puzzle[Math.floor(block/3)][block%3][ii] == num) {
			return false
		}
	}
	return true
}

function checkBlockRow(puzzle) {
	var allBlockRows = []
	for (var blockRow=0;blockRow<3;blockRow++) {
		for (var blockCol=0;blockCol<3;blockCol++) {
			var madeNums = [0]
			for (var i=0;i<9;i++) {
				if (puzzle[blockRow][blockCol][i] != 0) {
					madeNums.push(puzzle[blockRow][blockCol][i])
				}
			}
			var missingNums = []
			for (var i=1;i<10;i++) {
				var foundMatch = false;
				for (var iii=0;iii<madeNums.length;iii++) {
					if (madeNums[iii]==i){foundMatch = true; break;}
				}
				if (foundMatch) {
				}
				else {
					missingNums.push(i)
				}
			}
			for (var iii=0;iii<missingNums.length;iii++) {
				var i = missingNums[iii]
				var row1 = false
				var row2 = false
				var row3 = false
				for (var ii=0;ii<3;ii++) {
					if (fitSpotBasic(puzzle, blockRow*3,3*blockCol+ii,blockRow*3+blockCol, i)) {
						row1 = true
					}
					if (fitSpotBasic(puzzle, blockRow*3+1,3*blockCol+ii,blockRow*3+blockCol, i)) {
						row2 = true
					}
					if (fitSpotBasic(puzzle, blockRow*3+2,3*blockCol+ii,blockRow*3+blockCol, i)) {
						row3 = true
					}
				}
				
				if (row1 && !row2 && !row3) {
					allBlockRows.push([i,blockRow,blockCol,0])
				}
				if (!row1 && row2 && !row3) {
					allBlockRows.push([i,blockRow,blockCol,1])
				}
				if (!row1 && !row2 && row3) {
					allBlockRows.push([i,blockRow,blockCol,2])
				}
			}
		}
	}
	return allBlockRows
} 

function checkBlockCol(puzzle) {
	var allBlockCols = []
	for (var blockRow=0;blockRow<3;blockRow++) {
		for (var blockCol=0;blockCol<3;blockCol++) {
			var madeNums = [0]
			for (var i=0;i<9;i++) {
				if (puzzle[blockRow][blockCol][i] != 0) {
					madeNums.push(puzzle[blockRow][blockCol][i])
				}
			}
			var missingNums = []
			for (var i=1;i<10;i++) {
				var foundMatch = false;
				for (var iii=0;iii<madeNums.length;iii++) {
					if (madeNums[iii]==i){foundMatch = true; break;}
				}
				if (foundMatch) {
				}
				else {
					missingNums.push(i)
				}
			}
			for (var iii=0;iii<missingNums.length;iii++) {
				var i = missingNums[iii]
				var col1 = false
				var col2 = false
				var col3 = false
				for (var ii=0;ii<3;ii++) {
					if (fitSpotBasic(puzzle, blockRow*3+ii,3*blockCol,blockRow*3+blockCol,i)) {
						col1 = true
					}
					if (fitSpotBasic(puzzle, blockRow*3+ii,3*blockCol+1,blockRow*3+blockCol,i)) {
						col2 = true
					}
					if (fitSpotBasic(puzzle, blockRow*3+ii,3*blockCol+2,blockRow*3+blockCol,i)) {
						col3 = true
					}
				}
				if (col1 && !col2 && !col3) {
					allBlockCols.push([i,blockRow,blockCol,0])
				}
				if (!col1 && col2 && !col3) {
					allBlockCols.push([i,blockRow,blockCol,1])
				}
				if (!col1 && !col2 && col3) {
					allBlockCols.push([i,blockRow,blockCol,2])
				}
			}
		}
	}
	return allBlockCols
}  

function fitSpotFull(puzzle, row, col, block, num, allBlockRows, allBlockCols) {
	if (puzzle[Math.floor(block/3)][block%3][3*(row%3)+col%3] != 0) {
		return false
	}
	for (var ii=0;ii<9;ii++) {
		if (puzzle[Math.floor(row/3)][Math.floor(ii/3)][ii%3+3*(row%3)] == num) {
			return false
		}
	}
	for (var ii=0;ii<allBlockRows.length;ii++) {
		var iii = allBlockRows[ii];
		if (num == iii[0] && Math.floor(row/3) == iii[1] && Math.floor(col/3) != iii[2] && row%3 == iii[3]) {
			return false
		}
	}
	for (var ii=0;ii<9;ii++) {
		if (puzzle[Math.floor(ii/3)][Math.floor(col/3)][3*(ii%3)+col%3] == num) {
			return false
		}
	}
	for (var ii=0;ii<allBlockCols.length;ii++) {
		var iii = allBlockCols[ii];
		if (num == iii[0] && Math.floor(row/3) != iii[1] && Math.floor(col/3) == iii[2] && col%3 == iii[3]) {
			return false
		}
	}
	for (var ii=0;ii<9;ii++) {
		if (puzzle[Math.floor(block/3)][block%3][ii] == num) {
			return false
		}
	}
	return true
}

function checkRowFull(puzzle, allBlockRows, allBlockCols){
	var startTime = performance.now();
	var allPlays = []
	for (var num=1;num<10;num++){
		for (var rowi in possibleRows[num]) {
			var row = possibleRows[num][rowi];
			var numSpots = -1
			for (var i=0;i<9;i++) {
				if (fitSpotFull(puzzle, row, i, Math.floor(i/3)+3*Math.floor(row/3), num, allBlockRows, allBlockCols)) {
					if (numSpots == -1) {
						numSpots = i
					}
					else {
						numSpots = -1
						break
					}
				}
			}
			if (numSpots != -1) {
				allPlays.push([num,Math.floor( (Math.floor(numSpots/3)+3*Math.floor(row/3))/3 ),(Math.floor(numSpots/3)+3*Math.floor(row/3))%3,3*(row%3)+numSpots%3])
			}
		}
	}
	elapsedTime += performance.now()-startTime;
	return allPlays
}

function checkColumnFull(puzzle, allBlockRows, allBlockCols) {
	var allPlays = []
	for (var num=1;num<10;num++){
		for (var col=0;col<9;col++) {
			var numSpots = -1
			for (var i=0;i<9;i++) {
				if (fitSpotFull(puzzle, i, col, Math.floor(col/3)+3*Math.floor(i/3), num, allBlockRows, allBlockCols)) {
					if (numSpots == -1) {
						numSpots = i
					}
					else {
						numSpots = -1
						break
					}
				}
			}
			if (numSpots != -1) {
				allPlays.push([num,Math.floor( (Math.floor(col/3)+3*Math.floor(numSpots/3))/3 ),(Math.floor(col/3)+3*Math.floor(numSpots/3))%3,3*(numSpots%3)+col%3])
			}
		}
	}
	return allPlays
}

function checkBlockFull(puzzle, allBlockRows, allBlockCols){
	var allPlays = []
	for (var num=1;num<10;num++){
		for (var block=0;block<9;block++) {
			var numSpots = -1
			for (var i=0;i<9;i++) {
				if (fitSpotFull(puzzle, 3*Math.floor(block/3)+Math.floor(i/3), 3*(block%3)+i%3, block, num, allBlockRows, allBlockCols)) {
					if (numSpots == -1) {
						numSpots = i
					}
					else {
						numSpots = -1
						break
					}
				}
			}
			if (numSpots != -1) {
				allPlays.push([num,Math.floor((block)/3),(block)%3,3*((3*Math.floor(block/3)+Math.floor(numSpots/3))%3)+(3*(block%3)+numSpots%3)%3])
			}
		}
	}
	return allPlays
}

function checkCells(puzzle, allBlockRows, allBlockCols) {
	var allPlays = []
	for (var blockRow=0;blockRow<3;blockRow++) {
		for (var blockCol=0;blockCol<3;blockCol++) {
			for (var i=0;i<9;i++) {
				if (puzzle[blockRow][blockCol][i] == 0) {
					var nFit = -1
					for (var ii=1;ii<10;ii++) {
						if (fitSpotFull(puzzle,blockRow*3+Math.floor(i/3),blockCol*3+i%3,blockRow*3+blockCol,ii, allBlockRows, allBlockCols)) {
							if (nFit == -1) {
								nFit = ii
							}
							else {
								nFit = -1
								break
							}
						}
					}
					if (nFit != -1) {
						allPlays.push([nFit,blockRow,blockCol,i])
					}
				}
			}
		}
	}
	return allPlays
}

function randomStrategy(allPlays) {
	let randIndex = Math.floor(Math.random() * allPlays.length)
	return randIndex
}

function goodStrategy(allPlays) {
	
	var goodNums = []
	var playIndex = [0,0,0,0,0,0,0,0,0,0]
	for (var ii=1;ii<10;ii++) {
		for (var i=0;i<allPlays.length;i++) {
			if (allPlays[i][0] == ii) {
				goodNums.push(ii)
				playIndex[ii]=i
				break
			}
		}
	}

	var minTurns = 100
	var chooseIndex = 0
	for (var i=1;i<7;i++) {
		if (itemSpends[i]>itemGets[i]){
			let nTurns = Math.floor(itemTotals[i]/(itemSpends[i]-itemGets[i]))
			if (nTurns < minTurns) {
				minTurns = nTurns
				chooseIndex = i
			}
		}
	}
	if (chooseIndex == 0) {
		var minNet = itemGets[1]-itemSpends[1]
		for (var i=1;i<7;i++) {
			var totalNet = itemTotals[i]*(itemGets[i]-itemSpends[i])
			if (totalNet <= minNet){
				minNet = totalNet
				chooseIndex = i
			}
		}
	}

	if (chooseIndex >0 && chooseIndex <= 6) {
		var arrData = []
		for (var i=1;i<10;i++){
			arrData.push([i,itemPerThing[chooseIndex][i-1]-spendPerThing[chooseIndex][i-1]]);
		}
		arrData = arrData.sort(function(a,b) {return b[1]-a[1];});
		var arr = [];
		for (var i=1;i<10;i++){
			arr.push(arrData[i-1][0]);
		}
		arr.forEach( i => {
			if (goodNums.includes(i)) {
				return playIndex[i]
			}
		})
	}
	let randIndex = Math.floor(Math.random() * allPlays.length)
	return randIndex
}

function runSimulation() {

	resetPuzzle()
	let savednPeople = nPeople //int
	var savedcurrentPuzzle = []
	for (var iiii=0;iiii<3;iiii++) {
		savedcurrentPuzzle.push([]);
		for (var iii=0;iii<3;iii++) {
			savedcurrentPuzzle[iiii].push(currentPuzzle[iiii][iii].slice());
			
		}
	}
	let savednYear = nYear //int
	
	var easyPuzzle = true
	
	while (stopSudoku) {
		
		var allPlays = []
		/*allPlays = allPlays.concat(checkRow(currentPuzzle))
		allPlays = allPlays.concat(checkColumn(currentPuzzle))
		allPlays = allPlays.concat(checkBlock(currentPuzzle))
		*/
		
		let allBlockRows = checkBlockRow(currentPuzzle)
		let allBlockCols = checkBlockCol(currentPuzzle)
		allPlays = allPlays.concat(checkRowFull(currentPuzzle, allBlockRows, allBlockCols))
		allPlays = allPlays.concat(checkColumnFull(currentPuzzle, allBlockRows, allBlockCols))
		allPlays = allPlays.concat(checkBlockFull(currentPuzzle, allBlockRows, allBlockCols))
		allPlays = allPlays.concat(checkCells(currentPuzzle, allBlockRows, allBlockCols))
		
		if (allPlays.length>0) {
			updateBN()
			updateSG()
			let chooseIndex = goodStrategy(allPlays)
			currentPuzzle[allPlays[chooseIndex][1]][allPlays[chooseIndex][2]][allPlays[chooseIndex][3]]=allPlays[chooseIndex][0]
			
			
			for( var arri = 0; arri < possibleRows[allPlays[chooseIndex][0]].length; arri++){ 
				if ( possibleRows[allPlays[chooseIndex][0]][arri] === allPlays[chooseIndex][1]) { 
					possibleRows[allPlays[chooseIndex][0]].splice(arri, 1); break;
				}
			}
			
			
			updateBN()
			updateSG()
			for (var i=0;i<7;i++) {
				itemTotals[i]+=itemGets[i]
				itemTotals[i]-=itemSpends[i]
				if (itemTotals[i] < minTotals[i]) {
					minTotals[i] = itemTotals[i]
				}
			}

			updatePop()
		}
		else {
			var neededTotals = [0,0,0,0,0,0,0]
			
			for (var i=0;i<7;i++) {
				neededTotals[i] = initialTotals[i]-minTotals[i]
				if (neededTotals[i] > maxUsed) {
					easyPuzzle = false
				}
			}
			if (easyPuzzle) {
				easyPuzzle = false
				var num50 = 0
				var num100 = 0
				for (var i=0;i<7;i++) {
					neededTotals[i] = initialTotals[i]-minTotals[i]
					if (neededTotals[i] > needed1) {
						num50+=1
					}
					if (neededTotals[i] > needed2) {
						num100+=1
					}
				}
				if (num50 > 1 && num100 > 0) {
					easyPuzzle = true
				}
			}
			if (nYear != 81) {
				easyPuzzle = false
			}
			
			if (easyPuzzle) {
				
				
			}
			else if (nYear == 81) {
				//Add generic logic to add a number
				var neededTotalsIndex = -1;
				for (var ii=1;ii<7;ii++){
					if (neededTotals[ii] > maxUsed){
						neededTotalsIndex = ii;
					}
				}
				if (neededTotalsIndex > -1){
					var arrData = []
					for (var i=1;i<10;i++){
						arrData.push([i,itemPerThing[neededTotalsIndex][i-1]-spendPerThing[neededTotalsIndex][i-1]]);
					}
					arrData = arrData.sort(function(a,b) {return b[1]-a[1];});
					var arr = [];
					for (var i=1;i<10;i++){
						if (arrData[i-1][1]>0){
							arr.push(arrData[i-1][0]);
						}
						
					}
					var addedNow = false;
					arr.forEach( i => {
						if (!addedNow && addedNumbers[i]==0) {
							addedNumbers[i]+=1;
							addedNow = true;
						}
					})
					if (!addedNow){
						arr.forEach( i => {
							if (!addedNow && addedNumbers[i]==1) {
								addedNumbers[i]+=1;
								addedNow = true;
							}
						})
					}
					if (!addedNow){
						arr.forEach( i => {
							if (!addedNow && addedNumbers[i]==2) {
								addedNumbers[i]+=1;
								addedNow = true;
							}
						})
					}
					if (!addedNow){
						stopSudoku = false;
					}
				}
				
				
				var sumAdded = 0
				for (var i=1;i<10;i++) {
					sumAdded += addedNumbers[i]
				}
				if (sumAdded > 6) {
					easyPuzzle = false
					stopSudoku = false
				}
				else if (stopSudoku) {
					runSimulation()
				}
			}
			else {
				
			}
			stopSudoku = false
		}
	}
	
	if (easyPuzzle) {
		var neededTotals = [0,0,0,0,0,0,0]
		let maxRuns = 5
		
		for (var nRuns=1;nRuns<maxRuns+1;nRuns++) {	
			resetPuzzle()
			while (stopSudoku) {
			
			
				var allPlays = []
				/*allPlays = allPlays.concat(checkRow(currentPuzzle))
				allPlays = allPlays.concat(checkColumn(currentPuzzle))
				allPlays = allPlays.concat(checkBlock(currentPuzzle))
				*/
				
				let allBlockRows = checkBlockRow(currentPuzzle)
				let allBlockCols = checkBlockCol(currentPuzzle)
				allPlays = allPlays.concat(checkRowFull(currentPuzzle, allBlockRows, allBlockCols))
				allPlays = allPlays.concat(checkColumnFull(currentPuzzle, allBlockRows, allBlockCols))
				allPlays = allPlays.concat(checkBlockFull(currentPuzzle, allBlockRows, allBlockCols))
				allPlays = allPlays.concat(checkCells(currentPuzzle, allBlockRows, allBlockCols))
				
				
				if (allPlays.length>0) {
					updateBN()
					updateSG()
					let chooseIndex = randomStrategy(allPlays)
					currentPuzzle[allPlays[chooseIndex][1]][allPlays[chooseIndex][2]][allPlays[chooseIndex][3]]=allPlays[chooseIndex][0]

					updateBN()
					updateSG()
					for (var i=0;i<7;i++) {
						itemTotals[i]+=itemGets[i]
						itemTotals[i]-=itemSpends[i]
						if (itemTotals[i] < minTotals[i]) {
							minTotals[i] = itemTotals[i]
						}
					}

					updatePop()
		
				}
				else {
			
					for (var i=0;i<7;i++) {
						neededTotals[i]+=(initialTotals[i]-minTotals[i])/maxRuns
						
					}
					if (nRuns == maxRuns){
						var sumNeededTotals = 0
						for (var i=0;i<7;i++) {
							if (neededTotals[i] > initialTotal-1) {
								sumNeededTotals+=(neededTotals[i]-initialTotal)
							}
						}
						if (sumNeededTotals > sumNeeded) {
							var levelJson = {"startPeople":savednPeople,"puzzle":toCSS(savedcurrentPuzzle)};
							levelJson.initialTotals = initialTotals.slice();
							levelJson.itemPerThing = itemPerThing.slice(); //only one level of slice, but doesn't change?
							levelJson.spendPerThing = spendPerThing.slice();
							levelJson.spendPerPerson = spendPerPerson.slice();
							levelJson.bpy = [1,3]; //solver does not use this and nYear might not be 1 mod year
							
							//console.log(JSON.stringify(levelJson))
							fs.appendFileSync("../games/"+difficulty+"Raw.txt", JSON.stringify(levelJson)+"\n", function (err) {
								if (err){
									console.log(err);
								}
							});
							nMade++
							
						}
						else {
							return 1
						}
					}
					stopSudoku = false
				}
			}
		}
		return 2
	}
	else {
		return 3
	}
}

function execShellCommand(cmd) {
 return new Promise((resolve, reject) => {
  exec(cmd, (error, stdout, stderr) => {
   if (error) {
    console.warn(error);
   }
   resolve(stdout? stdout : stderr);
  });
 });
}
var allPuzzles = '';
var wget1 = 'qqwing --generate 100 --difficulty simple --symmetry random --solution --csv'
var wget2 = 'qqwing --generate 500 --difficulty easy --symmetry random --solution --csv'
var wget3 = 'qqwing --generate 100 --difficulty intermediate --symmetry random --solution --csv'

Promise.all([execShellCommand(wget1),execShellCommand(wget2),execShellCommand(wget3)]).then((values) => {
	allPuzzles =  values[0].replace("Puzzle,Solution,\n", "");
	allPuzzles +=  values[1].replace("Puzzle,Solution,\n", "");
	allPuzzles +=  values[2].replace("Puzzle,Solution,\n", "");
	allPuzzles = allPuzzles.replace(/\n/g, "")
	let puzzleArray = allPuzzles.split(",")
	for (var i=0;i<700;i++) {
		//console.log(i,performance.now());
		initialPuzzle = puzzleArray[i*2]
		solution = puzzleArray[i*2+1]
		if (initialPuzzle.length != 81 || solution.length != 81){continue;}
		addedNumbers = [0,0,0,0,0,0,0,0,0,0]
		var x = runSimulation();
		if (x < 2) {
			addedNumbers = [0,0,0,0,0,0,0,0,0,0]
			runSimulation()
		}
		if (i%100==0){
			console.log(i,elapsedTime, nMade);
		}	
	}
})




