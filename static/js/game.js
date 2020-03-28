var selectedButton = 0;
var el = document.getElementById('buttonRow');
var buttons = el.querySelectorAll('span');
for (var i=0;i<buttons.length;i++){
	buttons[i].addEventListener('click',chgButton);
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
	alert(selectedButton);
}