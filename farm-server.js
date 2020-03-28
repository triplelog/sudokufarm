'use strict';
const { PerformanceObserver, performance } = require('perf_hooks');
var fs = require("fs");
const assert = require('assert');


const https = require('https');
//var myParser = require("body-parser");
//var qs = require('querystring');
var nunjucks = require('nunjucks');

const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/matherrors.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/matherrors.com/fullchain.pem')
};



var express = require('express');
var app = express();
app.use('/',express.static('static'));


const server1 = https.createServer(options, app);

server1.listen(12312);

const server = https.createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('\n');
}).listen(8080);

const WebSocket = require('ws');
//const wss = new WebSocket.Server({ port: 8080 , origin: 'http://tabdn.com'});
const wss = new WebSocket.Server({ server });
wss.on('connection', function connection(ws) {
  	
  	ws.on('message', function incoming(message) {
		var dm = JSON.parse(message);
		
		
  	});
});


app.get('/game',
	function(req, res){
		/*var tkey = crypto.randomBytes(100).toString('hex').substr(2, 18);
		if (req.isAuthenticated()){
			tempKeys[tkey] = {username:req.user.username};
		}*/
		var cells = [];
		for (var i=0;i<9;i++){
			cells.push([]);
			for (var ii=0;ii<9;ii++){
				cells[i].push(0);
			}
		}
		res.write(nunjucks.render('templates/game.html',{
			cells: cells,
		}));
		res.end();
	
    }
    
);
app.get('/subtraction',
	function(req, res){
		var trophies = {'noborrow':false,'oneborrow':false,'twoborrows':false};
		res.write(nunjucks.render('topics/arithmetic.html',{
			type: 'Subtraction',
		}));
		res.end();
	
    }
    
);

function addIntsWrongJS(strs, answer){
	if (strs.length == 1){
		return "size is 1";
	}
	else if (strs.length == 0){
		return "size is 0";
	}

    
    
    
	var answerDigits = [];
	for (var it = answer.length-1;it>= 0;it--){
		answerDigits.push(parseInt(answer[it]));
	}
	var ii;
	var sz = 0;
	
	var digits = [];
	for (ii=0;ii<strs.length;ii++){
		var onestr = [];
		for (var it = strs[ii].length-1;it>= 0;it--){
			onestr.push(parseInt(strs[ii][it]));
		}
		if (onestr.length>sz){
			sz = onestr.length;
		}
		digits.push(onestr);
	}
	var dsz = digits.length;
	var adsz = answerDigits.length;
	for (ii=0;ii<dsz;ii++){
		var i;
		for (i = digits[ii].length;i<sz;i++){
			digits[ii].push(0);
		}
	}
	
	
	var digits0 = [0,0,0,0,0];
	var errors = "";
	var returnString = "";
	var iii;
	var isPossible = true;
		
	var i; var di;
	var carry = 0;
	var digit = 0;
	var newdigit = 0;
	for (iii=0;iii<100000;iii++){
		errors = "";
		di = 0;
		isPossible = true;
		carry = 0;
		digit = 0;
		newdigit = 0;
		
		for (i=0;i<sz;i++){
			digit = carry;
			for (ii=0;ii<dsz;ii++){
				newdigit = digit + digits[ii][i];
				if (Math.trunc(newdigit/10) > Math.trunc(digit/10) && iii % 1000 > 970){
					digit = newdigit - 10;
					//std::string d(1,i+'2'); //next digit will be wrong, and start at 1 not 0 -- only up to 9th digit
					//errors += "You missed a carry on "+d+"rd digit from right.\n";
					errors += "You missed a carry.\n";
				}
				else {
					digit = newdigit;
				}
			}
			if (digit>9){
				digits0[di] = digit%10;
				di++;
				carry = Math.trunc(digit/10);
			}
			else {
				digits0[di] = digit;
				di++;
				carry = 0;
			}
			
			if (adsz <= i || digits0[i] !=answerDigits[i]){
				isPossible = false;
				break;
			}
		}
		if (!isPossible){continue;}
		while (carry > 0){
			if (carry>9){
				digits0[di] = carry%10;
				di++;
				carry = Math.trunc(carry/10);
			}
			else {
				digits0[di] = carry;
				di++;
				carry = 0;
			}
			if (adsz <= i || digits0[i] !=answerDigits[i]){
				isPossible = false;
				break;
			}
			i++;
		}
		if (isPossible && adsz == di){
			returnString = errors;
			//returnString += "The correct answer is " + addInts(strs);
		}
		
	}
	return returnString;
	//return "done";
}



