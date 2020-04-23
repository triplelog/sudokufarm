var ws = new WebSocket('wss://soliturn.com:8080');
ws.onopen = function(evt) {
	
	//var jsonmessage = {'operation':'key','message':key};
	//ws.send(JSON.stringify(jsonmessage));
	
	
}
ws.onmessage = function(evt){
	var dm;
	if (evt.data[0]=='{'){
		dm = JSON.parse(evt.data);
	}
	if (dm.puzzle){
		console.log(dm.puzzle);
		document.getElementById("sudoku").value = dm.puzzle;
		chgSudoku();
	}
}
function chgResource(evt) {
	var el = evt.target;
	var id = parseInt(el.id.substr(8,9));
	var ell = document.getElementById("emojiData");
	var elll = ell.querySelectorAll("td")[id-1];
	emojiList[id-1] = el.value;
	elll.textContent = el.value;
	
	document.getElementById("income"+id+"emoji").textContent = el.value;
}


document.getElementById("resource1emoji").addEventListener('change',chgResource);
document.getElementById("resource2emoji").addEventListener('change',chgResource);
document.getElementById("resource3emoji").addEventListener('change',chgResource);
document.getElementById("resource4emoji").addEventListener('change',chgResource);
document.getElementById("resource5emoji").addEventListener('change',chgResource);
document.getElementById("resource6emoji").addEventListener('change',chgResource);
document.getElementById("resource7emoji").addEventListener('change',chgResource);


function chgItem(evt) {
	var el = evt.target;
	var id = parseInt(el.id.substr(4,5));
	imgList[id]=el.value;
}
document.getElementById("item1icon").addEventListener('change',chgItem);
document.getElementById("item2icon").addEventListener('change',chgItem);
document.getElementById("item3icon").addEventListener('change',chgItem);
document.getElementById("item4icon").addEventListener('change',chgItem);
document.getElementById("item5icon").addEventListener('change',chgItem);
document.getElementById("item6icon").addEventListener('change',chgItem);
document.getElementById("item7icon").addEventListener('change',chgItem);
document.getElementById("item8icon").addEventListener('change',chgItem);
document.getElementById("item9icon").addEventListener('change',chgItem);


function chgSudoku() {
	var el = document.getElementById("sudoku");
	var puzzleRaw = el.value;
	puzzleRaw = puzzleRaw.replace(/\s/g,'');
	puzzleRaw = puzzleRaw.replace(/\t/g,'');
	puzzleRaw = puzzleRaw.replace(/\n/g,'');
	puzzleRaw = puzzleRaw.replace(/\|/g,'');
	puzzleRaw = puzzleRaw.replace(/-/g,'');
	puzzleRaw = puzzleRaw.replace(/\./g,'0');
	var puzzles = [];
	var puzzle = [];
	var row = [];
	for (var i=0;i<puzzleRaw.length;i++){
		if ('0123456789'.indexOf(puzzleRaw[i])>-1){
			row.push(puzzleRaw[i]);
		}
		if (row.length == 9){
			puzzle.push(row);
			row = [];
		}
		if (puzzle.length==9){
			puzzles.push(puzzle);
			puzzle = [];
		}
	}
	console.log(puzzles);
}
function randomSudoku(evt) {
	var jsonmessage = {'type':'sudoku','difficulty':'simple'};
	ws.send(JSON.stringify(jsonmessage));
	
}
document.getElementById("sudoku").addEventListener('change',chgSudoku);
document.getElementById("randomSimple").addEventListener('click',randomSudoku);


