(function(){
	var paths = ['file1.txt', 'file2.txt', 'file3.txt'];

	// npm install async
	var fs = require('fs'),
		async = require('async');

	var file1 = paths.shift();


	function fileSizeBy5(file){
		return function(callback) {
			fs.stat(file, function(error, stat) {
			    console.log('1st callback');
				callback(error, stat.size * 5);
			});
		}
	}

	//fileSizeBy5('file1')(function(err, success){
	//	//do something...
	//})

	function mapStat(paths){
		return function(callback) {
			async.map(paths, fs.stat, function(error, results){
				console.log('list fs.stat callback');
				console.dir(results);
				callback(error, results);
			});
		}
	}


	async.parallel([
		fileSizeBy5(file1),
		mapStat(paths)
	], function(err, results) {

		if(err){
			console.log('something wrong: ' + err);
			return;
		}

		//results[0] --> stat1.size * 5
		//results[1] --> [stat2, stat3]
		console.log('finish all: ' + results[0] + ': ' + results[1][0].size);

	});

})()