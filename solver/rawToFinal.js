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
	var wget = "echo "+rawpuzzle +' | qqwing --solve --stats --nosolution --csv';
	Promise.all([execShellCommand(wget)]).then((values) => {
		var output = values[0].split('\n')[1].split(',')[9];
		if (output == 'Simple'){
			gamesSimple.push(games[i]);
		}
		else if (output == 'Easy'){
			gamesEasy.push(games[i]);
		}
	})
}
console.log(gamesSimple.length);
console.log(gamesEasy.length);
/*fs.writeFileSync("../games/medium.txt", "", function (err) {
	if (err){
		console.log(err);
	}
});

for (var i=0;i<)*/




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
