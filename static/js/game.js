var selectedButton = 0;

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
		el.innerHTML = '';
		var img = document.createElement('img');
		img.setAttribute('src','../img/'+selectedButton+'.png');
		el.appendChild(img);
	}
	//add image
	//update puzzle
}