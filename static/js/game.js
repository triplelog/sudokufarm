var el = document.getElementById('buttonRow');
var buttons = el.querySelectorAll('span');
for (var i=0;i<buttons.length;i++){
	buttons[i].addEventListener('click',chgButton);
}
function chgButton(evt) {
	alert(evt.target.id);
}