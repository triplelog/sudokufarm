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
		console.log(JSON.parse(values[0])[9]);
	})
}

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
