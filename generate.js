/* Generate passphrases from form. Called onload and when Generate is clicked. */
function generate(form){
	var numWords = form.numWords.value; /* Number of words per passphrase. */
	var numPassphrases = form.numPassphrases.value; /* Number of passphrases. */
	var wordlist = eff_large_wordlist; /* Loaded via script tag in index.html */
	
	/* Build a list of passphrases */
	var passphraseList = [];
	for (var i=0;i<numPassphrases;i++) {
		passphraseList.push(buildPassphrase(wordlist,numWords));
	}

	/* Send list of passphrases to the page or a download. */
	if(form.display[0].checked){
		displayResults(passphraseList);
	} else if(form.display[1].checked){
		downloadResults(passphraseList);
	}
}

/* Create passphrase from a wordlist with the given number of words. */
function buildPassphrase(wordlist, numWords){
	var wordlistLength = wordlist.length;
	var passphrase = "";
	
	for (var i=0;i<numWords;i++){
		passphrase += wordlist[secureRandom(wordlist.length)] +" ";
	}
	
	return passphrase.trim();
}

/* Generate a secure random number */
function secureRandom(count){
	var rand = new Uint32Array(1);
	var skip = 0x7fffffff - 0x7fffffff % count;
	var result;
	var cryptoObj = window.crypto || window.msCrypto;

	do {
		cryptoObj.getRandomValues(rand);
		result = rand[0] & 0x7fffffff;
	} while (result >= skip);
	
	return result % count;
}

/* Add line breaks then inject the generated passphrases into #result */
function displayResults(passphraseList){
	var result = ""
	
	for(var i=0;i<passphraseList.length;i++){
		result += passphraseList[i] + '<br>';
	}
	
	document.getElementById("result").innerHTML = result;
	
}

/* Send the list of passphrases to the browser as a download. */
function downloadResults(passphraseList){
	var result = "";
	
	/* Add dos line endings. Win notepad only understands dos. Others are smart. */
	for (var i=0;i<passphraseList.length;i++){
		result += passphraseList[i]+"\r\n";
	}
	
	/* Create an a element with a data uri of the password list and click it. */
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(result));
	element.setAttribute('download', 'Passphrase List.txt');
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
}