var selectedButton = 0;
var itemSpends = [0,0,0,0,0,0,0];
var itemGets = [0,0,0,0,0,0,0];
function updateSGN() {
	var el = document.getElementById('changeData');
	var nets = el.querySelectorAll('td');
	for (var i=0;i<7;i++) {
		itemSpends[i]=spendPerPerson[i]*nPeople
		itemGets[i]=0
		for (var ii=0;ii<9;ii++) {
			itemSpends[i]+=existingPlots[ii]*spendPerThing[i][ii]
			itemGets[i]+=existingPlots[ii]*itemPerThing[i][ii]
			if (ii+1 == selectedButton){
				itemSpends[i]+=spendPerThing[i][ii]
				itemGets[i]+=itemPerThing[i][ii]
			}
		}
		
		if (i>0){
			nets[i-1].textContent = itemGets[i] - itemSpends[i];
		}
		
	}
	if (nYears%bpy[1] == 0){
		nets[6].textContent = bpy[0];
	}
	else {
		nets[6].textContent = 0;
	}
	
	
}

function updateTotals(save) {
	var el = document.getElementById('newData');
	var ts = el.querySelectorAll('td');
	for (var i=0;i<7;i++) {
		if (!save && selectedButton >0){
			if (i>0){
				ts[i-1].textContent = totals[i] + itemGets[i] - itemSpends[i];
			}
		}
		else if (!save){
			if (i>0){
				ts[i-1].textContent = totals[i];
			}
		}
		else {
			totals[i] += itemGets[i];
			totals[i] -= itemSpends[i];
			if (i>0){
				ts[i-1].textContent = totals[i];
			}
		}
		
	}
	ts[6].textContent = nPeople;
	for (var ii=0;ii<9;ii++) {
		if (existingPlots[ii] == 9){
			var el = document.getElementById('buttonRow').querySelectorAll('span')[ii];
			el.classList.add('finished');
			el.classList.remove('selected');
			if (selectedButton == ii+1){
				selectedButton = 0;
			}
		}
	}
}
updateSGN();	
		
var el = document.getElementById('buttonRow');
var buttons = el.querySelectorAll('span');
for (var i=0;i<buttons.length;i++){
	buttons[i].addEventListener('click',chgButton);
}

var el = document.getElementById('sudokuTable');
var cells = el.querySelectorAll('span');
for (var i=0;i<cells.length;i++){
	cells[i].addEventListener('click',updateCell);
}



function chgButton(evt) {
	var el = evt.target;
	while (el && el.tagName && el.tagName != 'SPAN'){
		el = el.parentElement;
	}
	if (selectedButton != parseInt(el.id.split('-')[1])){
		selectedButton = parseInt(el.id.split('-')[1]);
		el.classList.add('selected');
	}
	else {
		selectedButton = 0;
		el.classList.remove('selected');
	}
	var ell = document.getElementById('buttonRow');
	var buttons = ell.querySelectorAll('span');
	for (var i=0;i<buttons.length;i++){
		if (buttons[i].id != el.id){
			buttons[i].classList.remove('selected');
		}
	}
	updateSGN();
	//updateTotals(false);
}
function notPossible(type){
	alert('Already a '+selectedButton+' in that '+type);
}
function updateCell(evt){
	if (selectedButton == 0){return}
	var el = evt.target;
	while (el && el.tagName && el.tagName != 'SPAN'){
		el = el.parentElement;
	}
	//check if has image already
	var cellId = [parseInt(el.id.split('-')[1]),parseInt(el.id.split('-')[2])];
	var cellValue = parseInt(puzzle[cellId[0]][cellId[1]]);
	if (cellValue == 0){ 
		//check possible
		for (var i=0;i<puzzle.length;i++){
			if (puzzle[i][cellId[1]] == selectedButton){
				notPossible('col');
				return;
			}
		}
		for (var i=0;i<puzzle[cellId[0]].length;i++){
			if (puzzle[cellId[0]][i] == selectedButton){
				notPossible('row');
				return;
			}
		}
		for (var i=Math.floor(cellId[0]/3)*3;i<Math.floor(cellId[0]/3)*3+3;i++){
			for (var ii=Math.floor(cellId[1]/3)*3;ii<Math.floor(cellId[1]/3)*3+3;ii++){
				if (puzzle[i][ii] == selectedButton){
					notPossible('block');
					return;
				}
			}
		}
		//add image
		el.innerHTML = '';
		var img = document.createElement('img');
		img.setAttribute('src','../sfarm/'+selectedButton+'.png');
		el.appendChild(img);
		//Update puzzle
		puzzle[cellId[0]][cellId[1]] = selectedButton;
		//Update supplies
		existingPlots[selectedButton-1]++;
		
		updateSGN();
		updateTotals(true);
		if (nYears%bpy[1] == 0) {
			nPeople+=bpy[0];
		}
		nYears+=1
		//updateTotals(false);
		
	}
	
}