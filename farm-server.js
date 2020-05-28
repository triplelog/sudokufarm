'use strict';
const { PerformanceObserver, performance } = require('perf_hooks');
var fs = require("fs");
const assert = require('assert');


const https = require('https');
//var myParser = require("body-parser");
//var qs = require('querystring');
var crypto = require("crypto");
var nunjucks = require('nunjucks');

const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/soliturn.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/soliturn.com/fullchain.pem')
};


const mongoose = require('mongoose');
mongoose.connect('mongodb://triplelog:kZGWGda3A@45.32.213.227:27017/triplelog', {useNewUrlParser: true});
const SudokufarmUser = require('./models/sudokufarmuser');
var fromLogin = require('./login-server.js');
var app = fromLogin.loginApp;

var tempKeys = fromLogin.tempKeys;


var express = require('express');
app.use('/',express.static('static'));


const server1 = https.createServer(options, app);

server1.listen(12312);

const server = https.createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('\n');
}).listen(8080);

const WebSocket = require('ws');
const wss = new WebSocket.Server({ server });
wss.on('connection', function connection(ws) {
  	var gameid = '';
  	var username = '';
  	ws.on('message', function incoming(message) {
		var dm = JSON.parse(message);
		if (dm.type && dm.type == 'key'){
			if (dm.message && tempKeys[dm.message]){
				gameid = tempKeys[dm.message].gameid;
				username = tempKeys[dm.message].username;
			}
		}
		else if (dm.type == 'sudoku'){
			if (dm.difficulty == 'easy'){
				var puzzle = "...39.1.48..74...5.....8....5691.4..18..65.3.9.34.......5..4..1......8......5....";
				var jsonmessage = {'puzzle':puzzle};
				ws.send(JSON.stringify(jsonmessage));
			}
		}
		else if (dm.type == 'save'){
			if (gameid == '' && !dm.name){
				gameid = parseInt(crypto.randomBytes(50).toString('hex'),16).toString(36).substr(2, 12);
			}
			else if (dm.name) {
				gameid = dm.name;
			}
			dm.game.id = gameid;
			SudokufarmUser.findOne({username:username},function(err,result){
				var foundMatch = false;
				for (var i=0;i<result.games.length;i++){
					if (result.games[i].id == gameid){
						result.games[i] = dm.game;
						foundMatch = true;
						break;
					}
				}
				if (!foundMatch){
					result.games.push(dm.game);
				}
				result.markModified('games');
				result.save(function(err2,result2){
					var jsonmessage = {type:'saved',name:gameid};
					ws.send(JSON.stringify(jsonmessage))
				});
			})
		}
		
  	});
});

var defaultGames = {};
var puzzleTypes = ['daily','easy','medium','hard'];
for (var ii=0;ii<4;ii++ ){
	var daily;
	if (puzzleTypes[ii] == 'daily'){
		defaultGames[puzzleTypes[ii]] = {};
		daily = [];
	}
	else {
		defaultGames[puzzleTypes[ii]] = [];
	}
	var data;
	var lines;
	if (puzzleTypes[ii]=='daily'){
		data = fs.readFileSync('./games/hardDaily.txt', 'utf8');
		lines = data.split('\n');
		lines.splice(0,110);
		console.log(lines.length);
		data = fs.readFileSync('./games/easyDaily.txt', 'utf8');
		lines = lines.concat(data.split('\n'));
		console.log(lines.length);
		data = fs.readFileSync('./games/mediumDaily.txt', 'utf8');
		lines = lines.concat(data.split('\n'));
		console.log(lines.length);
	}
	else {
		data = fs.readFileSync('./games/'+puzzleTypes[ii]+'.txt', 'utf8');
		lines = data.split('\n');
	}

	  for (var i=0;i<lines.length;i++){
		var line = lines[i];
		if (line.length>10){
	  		if (puzzleTypes[ii] == 'daily'){
				daily.push(JSON.parse(line));
			}
			else {
				defaultGames[puzzleTypes[ii]].push(JSON.parse(line));
			}
	  	}
	  }
	  if (puzzleTypes[ii] == 'daily'){
	  	var w = 0;
	  	for (var y=2020;y<2022;y++){
	  		for (var m=1;m<13;m++){
	  			for (var d=1;d<32;d++){
	  				var da = new Date(m+'/'+d+'/'+y);
	  				if (!isNaN(da.getDate())){
	  					var day = da.getDay();
	  					var puzzle = daily[110*day+(w%110)];
	  					defaultGames['daily'][m+'/'+d+'/'+y]=puzzle;
	  					if (day == 0){
	  						w++;
	  					}
	  				}
	  			}
	  		}
	  	}
	  }
}

	  
app.get('/index.html',
	function(req, res){
		res.write(nunjucks.render('templates/index.html',{
			
		}));
		res.end();
	
    }
);
app.get('/',
	function(req, res){
		res.write(nunjucks.render('templates/index.html',{
			
		}));
		res.end();
	
    }
);

app.get('/tutorial.html',
	function(req, res){
		
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
		
		res.write(nunjucks.render('templates/tutorialbase.html',{
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

app.get('/game.html',
	function(req, res){
		var levelJson;
		var gametype = 'easy';
		var gameid = 1;
		if (req.query && req.query.l){
			if (req.query.l.substring(0,4) == 'easy'){
				gametype = 'easy';
				gameid = parseInt(req.query.l.substring(4));
				if (isNaN(gameid) || gameid<1){
					res.redirect('../game.html?l=easy1');
					return;
				}
				else if (gameid>81){
					res.redirect('../game.html?l=easy81');
					return;
				}
				levelJson = defaultGames[gametype][gameid-1];
			}
			else if (req.query.l.substring(0,6) == 'medium'){
				gametype = 'medium';
				gameid = parseInt(req.query.l.substring(6));
				if (isNaN(gameid) || gameid<1){
					res.redirect('../game.html?l=medium1');
					return;
				}
				else if (gameid>81){
					res.redirect('../game.html?l=medium81');
					return;
				}
				levelJson = defaultGames[gametype][gameid-1];
			}
			else if (req.query.l.substring(0,4) == 'hard'){
				gametype = 'hard';
				gameid = parseInt(req.query.l.substring(4));
				if (isNaN(gameid) || gameid<1){
					res.redirect('../game.html?l=hard1');
					return;
				}
				else if (gameid>81){
					res.redirect('../game.html?l=hard81');
					return;
				}
				levelJson = defaultGames[gametype][gameid-1];
			}
		}
		else if (req.query && req.query.d){
			gametype = 'daily';
			var d = new Date(req.query.d);
			if (!isNaN(d.getDate()) && d.getYear >=120 && d.getYear() < 122){
				var month = d.getMonth()+1;
				var date = d.getDate();
				var year = d.getYear()+1900;
				levelJson = defaultGames[gametype][month+'/'+date+'/'+year];
				d.setDate(d.getDate()-1);
				month = d.getMonth()+1;
				date = d.getDate();
				year = d.getYear()+1900;
				gameid = month+'/'+date+'/'+year;
			}
			else {
				var d = new Date();
				var month = d.getMonth()+1;
				var date = d.getDate();
				var year = d.getYear()+1900;
				levelJson = defaultGames[gametype][month+'/'+date+'/'+year];
				d.setDate(d.getDate()-1);
				month = d.getMonth()+1;
				date = d.getDate();
				year = d.getYear()+1900;
				gameid = month+'/'+date+'/'+year;
			}
		}
		else {
			var d = new Date();
			var month = d.getMonth()+1;
			var date = d.getDate();
			var year = d.getYear()+1900;
			levelJson = defaultGames[gametype][month+'/'+date+'/'+year];
			d.setDate(d.getDate()-1);
			month = d.getMonth()+1;
			date = d.getDate();
			year = d.getYear()+1900;
			gameid = month+'/'+date+'/'+year;
		}


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
app.get('/:userid/:gameid',
	function(req, res){
		if (req.isAuthenticated() && req.user.username == req.params.userid && req.query.q && req.query.q == 'edit'){
			res.redirect('../create?name='+req.params.gameid);
			return;
		}
		else if (req.isAuthenticated() && req.user.username == req.params.userid && req.query.q && req.query.q == 'fork'){
			res.redirect('../create?name='+req.params.gameid+'&fork=true');
			return;
		}
		else if (req.isAuthenticated() && req.query.q && req.query.q == 'edit'){
			res.redirect('../create?name='+req.params.gameid+'&user='+req.params.userid);
			return;
		}
		console.log(req.params);
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
		SudokufarmUser.findOne({username:req.params.userid},function(err,result){
			var levelJson;
			var foundMatch = false;
			if (!result || !result.games){
				res.redirect('../account');
				return;
			}
			for (var i=0;i<result.games.length;i++){
				if (result.games[i].id == req.params.gameid){
					levelJson = result.games[i];
					foundMatch = true;
					break;
				}
			}
			if (foundMatch){
				var imgList = levelJson.imgList;
				var emojiList = levelJson.emojiList;
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
					totals: levelJson.totals,
					nPeople: levelJson.nPeople,
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
			else {
				res.redirect('../account');
			}
		})
		
	
    }
    
);

app.get('/create',
	function(req, res){
		
		var tkey = crypto.randomBytes(100).toString('hex').substr(2, 18);
		var gameid = '';
		var oldid = '';
		var olduser = '';
		if (req.query && req.query.name){
			gameid = req.query.name;
			if (req.query.fork == 'true'){
				gameid = parseInt(crypto.randomBytes(50).toString('hex'),16).toString(36).substr(2, 12);
				oldid = req.query.name;
			}
			if (req.query.user){
				gameid = parseInt(crypto.randomBytes(50).toString('hex'),16).toString(36).substr(2, 12);
				oldid = req.query.name;
				olduser = req.query.user;
			}
		}
		else {
			gameid = parseInt(crypto.randomBytes(50).toString('hex'),16).toString(36).substr(2, 12);
		}
		var username = '';
		var matches = false;
		tempKeys[tkey]={username:'',gameid:gameid};
		if (req.isAuthenticated()){
			tempKeys[tkey].username = req.user.username;
			username = req.user.username;
		}
		else {
			//Add a redirect to account page
		}
		//startPeople as int
		//bpy as [births,years]
		//itemPerThing as array of 7 arrays of 9 with first blank
		//spendPerThing as array of 7 arrays of 9 with first blank
		//spendPerPerson as array of 7 ints with first blank
		//initialTotals as array of 7 ints with first blank
		//puzzle as array of 9 rows of 9
		//map to image sources -- need to to on both ends
		var levelJson = {"startPeople":10,"puzzle":[["0","0","3","1","0","5","0","0","0"],["6","0","0","0","0","4","0","0","0"],["0","0","9","6","0","0","8","0","3"],["2","0","1","0","0","0","0","3","0"],["0","8","0",4,"0",3,"0","1","7"],["5","0","4",7,"0","0","0","9","0"],["0","0","5","2","0","0","3","0","6"],["3","0","0",9,"0","8","0","0","0"],["0","0","2","5","0","7","0","0",9]],"initialTotals":[0,200,200,200,200,200,200],"itemPerThing":[[0,0,0,0,0,0,0,0,0],[21,16,3,0,0,10,30,15,6],[0,0,0,30,0,0,0,0,0],[0,0,0,0,0,3,0,15,24],[10,10,10,0,0,0,0,0,0],[0,0,0,0,15,2,0,0,0],[5,0,13,0,0,0,0,0,0]],"spendPerThing":[[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[1,1,1,0,0,0,5,5,5],[20,10,10,0,0,0,0,0,0],[0,0,0,0,0,0,10,10,10],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0]],"spendPerPerson":[0,30,3,0,0,5,5],"bpy":[1,3]};
		//var imgList = [0,1,2,3,4,5,6,7,8,9];
		var imgList= [ 0, 'icons/farming/png/bees', 2, 3, 4, 5, 6, 7, 8, 9 ]
		var imgName= [ 0, 'Bees','Chicken','Sheep','Water','Tree','Apple','Bean','Wheat','Corn' ]
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
		//Get list of available icons
		var availableIcons = {'farming':['Bees','Cow','Duck','Cow']};
			
		if (req.query.name){
			var searchuser = username;
			var searchid = gameid;
			if (olduser != ''){
				searchuser = olduser;
			}
			if (oldid != ''){
				searchid = oldid;
			}
			SudokufarmUser.findOne({username:searchuser},function(err,result){
				var levelJson;
				var foundMatch = false;
				if (result && result.games){
					for (var i=0;i<result.games.length;i++){
						if (result.games[i].id == searchid){
							levelJson = result.games[i];
							foundMatch = true;
							break;
						}
					}
				}
				
				if (foundMatch){
					var imgList = levelJson.imgList;
					var emojiList = levelJson.emojiList;
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
				
					res.write(nunjucks.render('templates/createbase.html',{
						cells: levelJson.cells,
						puzzle: levelJson.puzzle,
						totals: levelJson.totals,
						nPeople: levelJson.nPeople,
						bpy: levelJson.bpy,
						existingPlots: levelJson.existingPlots,
						itemPerThing: levelJson.itemPerThing,
						spendPerThing: levelJson.spendPerThing,
						spendPerPerson: levelJson.spendPerPerson,
						imgList: imgList,
						emojiList: emojiList,
						
						imgName: imgName,
						
						tkey: tkey,
						availableIcons: availableIcons,
						username: username,
						gameid: gameid,
			
					}));
					res.end();
					return;
			
			
				}
				else {
					res.redirect('../create');
				}
			});
		}
		else {
			
			res.write(nunjucks.render('templates/createbase.html',{
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
				imgName: imgName,
				emojiList: emojiList,
				tkey: tkey,
				availableIcons: availableIcons,
				username: username,
				gameid: gameid,
			}));
			res.end();
		}
		
		
		
	
    }
    
);



