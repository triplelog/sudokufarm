'use strict';
const { PerformanceObserver, performance } = require('perf_hooks');
var fs = require("fs");
const { exec } = require('child_process');

var difficulty = 'hard';
var nMade = 0
var data = fs.readFileSync("../games/"+difficulty+"Raw.txt", 'utf8');
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
var gamesIntermediate = [];
var gamesExpert = [];
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
		else if (output == 'Intermediate'){
			gamesIntermediate.push(games[i]);
		}
		else if (output == 'Expert'){
			gamesExpert.push(games[i]);
		}
		else {
			console.log(output)
		}
	}
	
	console.log(gamesSimple.length);
	console.log(gamesEasy.length);
	console.log(gamesIntermediate.length);
	console.log(gamesExpert.length);
	
	fs.writeFileSync("../games/"+difficulty+".txt", "", function (err) {
		if (err){
			console.log(err);
		}
	});
	for (var i=0;i<81;i++){
		var game = {};
		if (difficulty == 'easy'){
			game = gamesSimple[i];
		}
		else if (difficulty == 'medium'){
			if (i%4==0){
				game = gamesSimple[i/4];
			}
			else if (i%4 == 1){
				if (gamesEasy.length>(i-1)/4){
					game=gamesEasy[(i-1)/4]
				}
				else {
					game = gamesSimple[81+(i-1)/4];
				}
			}
			else if (i%4 == 2){
				if (gamesEasy.length>(i-2)/4){
					game=gamesEasy[(i-2)/4]
				}
				else {
					game = gamesSimple[162+(i-2)/4];
				}
			}
			else {
				if (gamesIntermediate.length>(80-i)/4){
					game=gamesIntermediate[(80-i)/4]
				}
				else if (gamesEasy.length>41+(80-i)/4){
					game=gamesEasy[41+(80-i)/4]
				}
				else {
					game = gamesSimple[120+(i-2)/4];
				}
			}
		}
		else {
			if (i%2 == 0){
				if (gamesEasy.length>(i-0)/2){
					game=gamesEasy[(i-0)/2]
				}
				else {
					game = gamesSimple[(i-0)/2];
				}
			}
			else {
				if (gamesIntermediate.length>(79-i)/2){
					game=gamesIntermediate[(79-i)/2]
				}
				else if (gamesEasy.length>41+(79-i)/2){
					game=gamesEasy[41+(79-i)/2]
				}
				else {
					game = gamesSimple[41+(79-i)/2];
				}
			}
		}
		
		fs.appendFileSync("../games/"+difficulty+".txt", JSON.stringify(game)+"\n", function (err) {
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
