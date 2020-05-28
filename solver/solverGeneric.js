'use strict';
const { PerformanceObserver, performance } = require('perf_hooks');
var fs = require("fs");
const { exec } = require('child_process');
//let initialPuzzle = "....15.9...3...4...893.461.39..6..87.2.....3....4.3...4..1.7..9..1...8..7..5.83.1"
//let solution = "246815793173926458589374612394261587625789134817453926458137269931642875762598341"
var initialPuzzle = "...25..8...8.7.1...6.....9....8139..8.24.9..5.1.........4...7...317.2.4.5.7...836"
var solution = "793251684248976153165348297456813972872469315319527468984635721631782549527194836"
//let initialTotals = [0,30000,10000,10000,10000,10000,10000]
let initialTotals = [0,200,200,200,200,200,200]
let maxUsed = 165 //dont let stock get below 35
var needed1 = 10 // increase to require more depletions
var needed2 = 20 // increase to require more depletions
var sumNeeded = 299 // increase to require more depletions

var nMade = 0
fs.writeFileSync("../games/medium.txt", "", function (err) {
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
		allPlays = allPlays.concat(checkRow( currentPuzzle))
		allPlays = allPlays.concat(checkColumn( currentPuzzle))
		allPlays = allPlays.concat(checkBlock( currentPuzzle))
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
				allPlays = allPlays.concat(checkRow(currentPuzzle))
				allPlays = allPlays.concat(checkColumn(currentPuzzle))
				allPlays = allPlays.concat(checkBlock(currentPuzzle))
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
							if (neededTotals[i] > 199) {
								sumNeededTotals+=(neededTotals[i]-200)
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
							fs.appendFileSync("../games/medium.txt", JSON.stringify(levelJson), function (err) {
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
var allPuzzles = '';
var wget = 'qqwing --generate 2 --difficulty simple --symmetry random --solution --csv'
var child = exec(wget, function(err, stdout, stderr) {
	if (err){
		console.log(err);
		//send message--likely file size limit
		return;
	}
	else {
		allPuzzles = stdout;
		console.log(allPuzzles);
		allPuzzles = allPuzzles.replace(/\n/g, "")
		let puzzleArray = allPuzzles.split(",")
		for (var i=0;i<2;i++) {
			//console.log(i,performance.now());
			initialPuzzle = puzzleArray[i*2]
			solution = puzzleArray[i*2+1]
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
	}

});


