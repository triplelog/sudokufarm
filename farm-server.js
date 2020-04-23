'use strict';
const { PerformanceObserver, performance } = require('perf_hooks');
var fs = require("fs");
const assert = require('assert');


const https = require('https');
//var myParser = require("body-parser");
//var qs = require('querystring');
var nunjucks = require('nunjucks');

const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/soliturn.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/soliturn.com/fullchain.pem')
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

app.get('/index.html',
	function(req, res){
		
		
		res.write(nunjucks.render('templates/index.html',{
			
		}));
		res.end();
	
    }
    
);


app.get('/game',
	function(req, res){
		
		/*var tkey = crypto.randomBytes(100).toString('hex').substr(2, 18);
		if (req.isAuthenticated()){
			tempKeys[tkey] = {username:req.user.username};
		}*/
		
		//startPeople as int
		//bpy as [births,years]
		//itemPerThing as array of 7 arrays of 9 with first blank
		//spendPerThing as array of 7 arrays of 9 with first blank
		//spendPerPerson as array of 7 ints with first blank
		//initialTotals as array of 7 ints with first blank
		//puzzle as array of 9 rows of 9
		//map to image sources -- need to to on both ends
		var levelJson = {"startPeople":10,"puzzle":[["0","0","3","1","0","5","0","0","0"],["6","0","0","0","0","4","0","0","0"],["0","0","9","6","0","0","8","0","3"],["2","0","1","0","0","0","0","3","0"],["0","8","0",4,"0",3,"0","1","7"],["5","0","4",7,"0","0","0","9","0"],["0","0","5","2","0","0","3","0","6"],["3","0","0",9,"0","8","0","0","0"],["0","0","2","5","0","7","0","0",9]],"initialTotals":[0,200,200,200,200,200,200],"itemPerThing":[[0,0,0,0,0,0,0,0,0],[21,16,3,0,0,10,30,15,6],[0,0,0,30,0,0,0,0,0],[0,0,0,0,0,3,0,15,24],[10,10,10,0,0,0,0,0,0],[0,0,0,0,15,2,0,0,0],[5,0,13,0,0,0,0,0,0]],"spendPerThing":[[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[1,1,1,0,0,0,5,5,5],[20,10,10,0,0,0,0,0,0],[0,0,0,0,0,0,10,10,10],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0]],"spendPerPerson":[0,30,3,0,0,5,5],"bpy":[1,3]};
		var imgList = [0,1,2,3,4,5,6,7,8,9];
		var emojiList = ['🍕','💦','🍚','💩','🔥','👕','👤'];
		levelJson.existingPlots = [0,0,0,0,0,0,0,0,0];
		levelJson.cells = [];
		for (var i=0;i<9;i++){
			levelJson.cells.push([]);
			for (var ii=0;ii<9;ii++){
				levelJson.cells[i].push(levelJson.puzzle[i][ii]);
				if (parseInt(levelJson.puzzle[i][ii])>0){
					levelJson.existingPlots[parseInt(levelJson.puzzle[i][ii])-1]++;
				}
			}
		}
		res.write(nunjucks.render('templates/gamebase.html',{
			cells: levelJson.cells,
			puzzle: levelJson.puzzle,
			totals: levelJson.initialTotals,
			nPeople: levelJson.startPeople,
			bpy: levelJson.bpy,
			existingPlots: levelJson.existingPlots,
			itemPerThing: levelJson.itemPerThing,
			spendPerThing: levelJson.spendPerThing,
			spendPerPerson: levelJson.spendPerPerson,
			imgList: imgList,
			emojiList: emojiList,
			
		}));
		res.end();
	
    }
    
);

app.get('/create',
	function(req, res){
		
		/*var tkey = crypto.randomBytes(100).toString('hex').substr(2, 18);
		if (req.isAuthenticated()){
			tempKeys[tkey] = {username:req.user.username};
		}*/
		
		//startPeople as int
		//bpy as [births,years]
		//itemPerThing as array of 7 arrays of 9 with first blank
		//spendPerThing as array of 7 arrays of 9 with first blank
		//spendPerPerson as array of 7 ints with first blank
		//initialTotals as array of 7 ints with first blank
		//puzzle as array of 9 rows of 9
		//map to image sources -- need to to on both ends
		var levelJson = {"startPeople":10,"puzzle":[["0","0","3","1","0","5","0","0","0"],["6","0","0","0","0","4","0","0","0"],["0","0","9","6","0","0","8","0","3"],["2","0","1","0","0","0","0","3","0"],["0","8","0",4,"0",3,"0","1","7"],["5","0","4",7,"0","0","0","9","0"],["0","0","5","2","0","0","3","0","6"],["3","0","0",9,"0","8","0","0","0"],["0","0","2","5","0","7","0","0",9]],"initialTotals":[0,200,200,200,200,200,200],"itemPerThing":[[0,0,0,0,0,0,0,0,0],[21,16,3,0,0,10,30,15,6],[0,0,0,30,0,0,0,0,0],[0,0,0,0,0,3,0,15,24],[10,10,10,0,0,0,0,0,0],[0,0,0,0,15,2,0,0,0],[5,0,13,0,0,0,0,0,0]],"spendPerThing":[[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[1,1,1,0,0,0,5,5,5],[20,10,10,0,0,0,0,0,0],[0,0,0,0,0,0,10,10,10],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0]],"spendPerPerson":[0,30,3,0,0,5,5],"bpy":[1,3]};
		
		res.write(nunjucks.render('templates/createbase.html',{
			itemPerThing: levelJson.itemPerThing,
			spendPerThing: levelJson.spendPerThing,
			spendPerPerson: levelJson.spendPerPerson,
		}));
		res.end();
	
    }
    
);



