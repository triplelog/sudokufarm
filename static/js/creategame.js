function chgResource(evt) {
	var el = evt.target;
	var id = parseInt(el.id.substr(8,9));
	console.log(id);
	var ell = document.getElementById("emojiData");
	var elll = ell.querySelectorAll("td")[id-1];
	console.log(elll);
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
	console.log(id);
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