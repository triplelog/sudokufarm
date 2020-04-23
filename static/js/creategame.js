function chgResource(evt) {
	var el = evt.target;
	var id = parseInt(el.id.substr(8,9));
	console.log(id);
	var ell = document.getElementById("emojiData");
	var elll = ell.querySelectorAll("td")[id-1];
	console.log(elll);
	elll.textContent = el.value;
}


document.getElementById("resource1emoji").addEventListener('change',chgResource);