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
		var levelJson = {"startPeople":9,"maxTurns":52,"puzzle":[["1","5","0","0","4","0","8",2,"0"],["0","0","0","9","0","0","0","0","4"],["3",9,"0","0","0","0","1","7","0"],["0","6","0","0","0","0","0","8","0"],["0","8","1","0","0","5","6","0","0"],["0","2","0","0","0","0","0","9","0"],["5","0","0","0","0","0","3","6","0"],["0","0","0","2","0","0",4,"0","7"],["6","1","0","0","7","0","9","0","0"]],"existingPlots":[4,3,2,3,3,4,3,3,4],"maxPlots":[5,6,7,6,6,5,6,6,5],"winpuzzle":[["1","5","6","3","4","7","8","2","9"],["2","7","8","9","6","1","5","3","4"],["3","9","4","5","8","2","1","7","6"],["7","6","3","1","9","4","2","8","5"],["9","8","1","7","2","5","6","4","3"],["4","2","5","6","3","8","7","9","1"],["5","4","7","8","1","9","3","6","2"],["8","3","9","2","5","6","4","1","7"],["6","1","2","4","7","3","9","5","8"]]};
		
		var cells = [];
		for (var i=0;i<9;i++){
			cells.push([]);
			for (var ii=0;ii<9;ii++){
				cells[i].push(levelJson.puzzle[i][ii]);
			}
		}
		res.write(nunjucks.render('templates/game.html',{
			cells: cells,
			puzzle: JSON.stringify(levelJson.puzzle),
		}));
		res.end();
	
    }
    
);




