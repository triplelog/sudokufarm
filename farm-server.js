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
		
		//startPeople
		//bpy as [births,years]
		//itemPerThing
		//spendPerThing
		//spendPerPerson
		//initialTotals
		//puzzle as array of 9 rows of 9
		var levelJson = {"startPeople":9,"puzzle":[["1","5","0","0","4","0","8",2,"0"],["0","0","0","9","0","0","0","0","4"],["3",9,"0","0","0","0","1","7","0"],["0","6","0","0","0","0","0","8","0"],["0","8","1","0","0","5","6","0","0"],["0","2","0","0","0","0","0","9","0"],["5","0","0","0","0","0","3","6","0"],["0","0","0","2","0","0",4,"0","7"],["6","1","0","0","7","0","9","0","0"]]};
		levelJson.initialTotals = [0,200,200,200,200,200,200];
		levelJson.itemPerThing = [[0,0,0,0,0,0,0,0,0],[21,16,3,0,0,10,30,15,6],[0,0,0,30,0,0,0,0,0],[0,0,0,0,0,3,0,15,24],[10,10,10,0,0,0,0,0,0],[0,0,0,0,15,2,0,0,0],[5,0,13,0,0,0,0,0,0]];
		levelJson.spendPerThing = [[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[1,1,1,0,0,0,5,5,5],[20,10,10,0,0,0,0,0,0],[0,0,0,0,0,0,10,10,10],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0]];
		levelJson.spendPerPerson = [0,30,3,0,0,5,5];
		levelJson.bpy = [1,3];
		
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
		res.write(nunjucks.render('templates/game.html',{
			cells: levelJson.cells,
			puzzle: levelJson.puzzle,
			totals: levelJson.initialTotals,
			nPeople: levelJson.startPeople,
			bpy: levelJson.bpy,
			existingPlots: levelJson.existingPlots,
			itemPerThing: levelJson.itemPerThing,
			spendPerThing: levelJson.spendPerThing,
			spendPerPerson: levelJson.spendPerPerson,
			
		}));
		res.end();
	
    }
    
);




