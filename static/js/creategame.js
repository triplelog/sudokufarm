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
		document.getElementById("sudoku").value = dm.puzzle;
		chgSudoku();
	}
}

function chgIPT(evt) {
	var el = evt.target;
	var i = parseInt(el.id.split('-')[1]);
	var iiminus1 = parseInt(el.id.split('-')[2]);
	var val = parseInt(el.value);
	if (val > 0){
		itemPerThing[i][iiminus1]=val;
		spendPerThing[i][iiminus1]=0;
	}
	else if (val <0){
		itemPerThing[i][iiminus1]=0;
		spendPerThing[i][iiminus1]=val;
	}
	else {
		itemPerThing[i][iiminus1]=0;
		spendPerThing[i][iiminus1]=0;
	}
	resetGame();
}
function chgSPP(evt) {
	var el = evt.target;
	var i = parseInt(el.id.split('-')[1]);
	var val = parseInt(el.value);
	if (val < 0){
		spendPerPerson[i]=-1*val;
	}
	else if (val >0){
		spendPerPerson[i]=-1*val;//Is a negative spend possible?
	}
	else {
		spendPerPerson[i]=0;
	}
	resetGame();
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

function chgInitial(evt) {
	var el = evt.target;
	var id = parseInt(el.id.substr(8,9));
	var ell = document.getElementById("initialData");
	var elll = ell.querySelectorAll("td")[id-1];
	elll.textContent = el.value;
	
	ell = document.getElementById("minimumData");
	elll = ell.querySelectorAll("td")[id-1];
	elll.textContent = el.value;
	
	if (id < 7){
		totalsReset[id]=parseInt(el.value);
		minTotalsReset[id]=parseInt(el.value);
	}
	else {
		nPeopleReset = parseInt(el.value);
	}
	resetGame();
}

document.getElementById("resource1emoji").addEventListener('change',chgResource);
document.getElementById("resource2emoji").addEventListener('change',chgResource);
document.getElementById("resource3emoji").addEventListener('change',chgResource);
document.getElementById("resource4emoji").addEventListener('change',chgResource);
document.getElementById("resource5emoji").addEventListener('change',chgResource);
document.getElementById("resource6emoji").addEventListener('change',chgResource);
document.getElementById("resource7emoji").addEventListener('change',chgResource);

document.getElementById("resource1initial").addEventListener('change',chgInitial);
document.getElementById("resource2initial").addEventListener('change',chgInitial);
document.getElementById("resource3initial").addEventListener('change',chgInitial);
document.getElementById("resource4initial").addEventListener('change',chgInitial);
document.getElementById("resource5initial").addEventListener('change',chgInitial);
document.getElementById("resource6initial").addEventListener('change',chgInitial);
document.getElementById("resource7initial").addEventListener('change',chgInitial);

function chgBPY(evt) {
	var el = evt.target;
	if (el.id == 'births'){
		bpyReset[0]=parseInt(el.value);
	}
	else {
		bpyReset[1]=parseInt(el.value);
	}
	resetGame();
}
document.getElementById("births").addEventListener('change',chgBPY);
document.getElementById("perYear").addEventListener('change',chgBPY);

function chgItem(evt) {
	var el = evt.target;
	var id = parseInt(el.id.substr(4,5));
	imgList[id]=el.getAttribute('data-value');
	var ell = document.getElementById('button-'+id);
	ell.innerHTML = '';
	var img = document.createElement('img');
	img.setAttribute('src',"../sfarm/"+el.getAttribute('data-value')+".png");
	ell.appendChild(img);
	
	ell = document.getElementById('header-'+id).querySelector('img');
	ell.setAttribute('src',"../sfarm/"+el.getAttribute('data-value')+".png");
		
	resetGame();
}

document.getElementById("item1icon").addEventListener('awesomplete-selectcomplete',chgItem);
document.getElementById("item2icon").addEventListener('awesomplete-selectcomplete',chgItem);
document.getElementById("item3icon").addEventListener('awesomplete-selectcomplete',chgItem);
document.getElementById("item4icon").addEventListener('awesomplete-selectcomplete',chgItem);
document.getElementById("item5icon").addEventListener('awesomplete-selectcomplete',chgItem);
document.getElementById("item6icon").addEventListener('awesomplete-selectcomplete',chgItem);
document.getElementById("item7icon").addEventListener('awesomplete-selectcomplete',chgItem);
document.getElementById("item8icon").addEventListener('awesomplete-selectcomplete',chgItem);
document.getElementById("item9icon").addEventListener('awesomplete-selectcomplete',chgItem);

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
	if (puzzles.length > 0){
		puzzleReset = [];
		for (var i=0;i<puzzles[0].length;i++){
			puzzleReset.push(puzzles[0][i].slice());
		}
		moves = [];		
		resetGame();
	}
}
function randomSudoku(evt) {
	var jsonmessage = {'type':'sudoku','difficulty':'simple'};
	ws.send(JSON.stringify(jsonmessage));
	
}
document.getElementById("sudoku").addEventListener('change',chgSudoku);
document.getElementById("randomSimple").addEventListener('click',randomSudoku);

function saveGame(evt) {
	var jsonmessage = {'type':'save','id':gameid};
	jsonmessage['puzzle']=puzzleReset;//is updating on change
	jsonmessage['totals']=totalsReset;//is updating on change
	jsonmessage['nPeople']=nPeopleReset;//is updating on change
	jsonmessage['bpy']=bpyReset;//is updating on change
	jsonmessage['itemPerThing']=itemPerThing;//is updating on change
	jsonmessage['spendPerThing']=spendPerThing;//is updating on change
	jsonmessage['spendPerPerson']=spendPerPerson;//is updating on change
	jsonmessage['imgList']=imgList;
	jsonmessage['emojiList']=emojiList;//is updating on change
	ws.send(JSON.stringify(jsonmessage));
}
document.getElementById("saveGame").addEventListener('click',saveGame);

