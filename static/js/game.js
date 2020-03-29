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
	
}
function chgPop() {
	if (nYear%3 == 0) {
		nPeople+=1
	}
	nYear+=1
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

function updateCell(evt){
	var el = evt.target;
	while (el && el.tagName && el.tagName != 'SPAN'){
		el = el.parentElement;
	}
	//check if has image already
	var cellId = [parseInt(el.id.split('-')[1]),parseInt(el.id.split('-')[2])];
	var cellValue = parseInt(puzzle[cellId[0]][cellId[1]]);
	if (cellValue == 0){ 
		//add image
		el.innerHTML = '';
		var img = document.createElement('img');
		img.setAttribute('src','../img/'+selectedButton+'.png');
		el.appendChild(img);
		//Update puzzle
		puzzle[cellId[0]][cellId[1]] = selectedButton;
		//Update supplies
		existingPlots[selectedButton-1]++;
		updateSGN();
		updateTotals(true);
		//updateTotals(false);
		
	}
	
}