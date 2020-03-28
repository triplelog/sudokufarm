var selectedButton = 0;
var el = document.getElementById('buttonRow');
var buttons = el.querySelectorAll('span');
for (var i=0;i<buttons.length;i++){
	buttons[i].addEventListener('click',chgButton);
}
function chgButton(evt) {
	var el = evt.target;
	console.log(el);
	while (el && el.tagName && el.tagName != 'span'){
		el = el.parentElement;
		console.log(el);
	}
	selectedButton = parseInt(el.id.split('-')[1]);
	alert(selectedButton);
}