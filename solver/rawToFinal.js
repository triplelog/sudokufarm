'use strict';
const { PerformanceObserver, performance } = require('perf_hooks');
var fs = require("fs");
const { exec } = require('child_process');


var nMade = 0
var data = fs.readFileSync("../games/mediumRaw.txt", 'utf8');
var lines = data.split('\n');
var puzzles = [];
var games = [];
for (var i=0;i<lines.length;i++){
	if (lines[i].length>10){
		puzzles.push(JSON.parse(lines[i]).puzzle);
		games.push(JSON.parse(lines[i]));
	}
}
var gamesSimple = [];
var gamesEasy = [];
var wget = 'echo';
for (var i=0;i<puzzles.length;i++){
	var rawpuzzle = '';
	for (var ii=0;ii<9;ii++){
		for (var iii=0;iii<9;iii++){
			if (puzzles[i][ii][iii]=='0'){
				rawpuzzle += '.';
			}
			else {
				rawpuzzle += puzzles[i][ii][iii];
			}
			
		}
	}
	wget += ' '+rawpuzzle;
	
	
}
wget += ' | qqwing --solve --stats --nosolution --csv';
Promise.all([execShellCommand(wget)]).then((values) => {
	//console.log(values[0])
	var outputArray = values[0].split('\n')
	for (var i=0;i<puzzles.length;i++){
		var output = outputArray[i+1].split(',')[9];
		if (output == 'Simple'){
			gamesSimple.push(games[i]);
		}
		else if (output == 'Easy'){
			gamesEasy.push(games[i]);
		}
	}
	
	console.log(gamesSimple.length);
	console.log(gamesEasy.length);
	
	fs.writeFileSync("../games/medium.txt", "", function (err) {
		if (err){
			console.log(err);
		}
	});
	for (var i=0;i<81;i++){
		var game = {};
		if (i%2==0){
			game = gamesSimple[i/2];
		}
		else{
			if (gamesEasy.length>(i-1)/2){
				game=gamesEasy[(i-1)/2]
			}
			else {
				game = gamesSimple[81+(i-1)/2];
			}
		}
		fs.appendFileSync("../games/medium.txt", JSON.stringify(game)+"\n", function (err) {
			if (err){
				console.log(err);
			}
		});
	}
	
	
})





function execShellCommand(cmd) {
 return new Promise((resolve, reject) => {
  exec(cmd, (error, stdout, stderr) => {
   if (error) {
    console.warn(error);
   }
   resolve(stdout? stdout : stderr);
  });
 });
}
